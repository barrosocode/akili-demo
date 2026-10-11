"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LessonContentTab } from "@/features/content-player/components/lesson-content-tab";
import { LessonQuestionsTab } from "@/features/content-player/components/lesson-questions-tab";
import {
  formatSessionDuration,
  StudentSessionCompleteDialog,
} from "@/features/content-player/components/student-session-complete-dialog";
import { LESSON_PREVIEW_FONTS_HREF } from "@/features/content-player/lib/lesson-theme";
import {
  AULA_TAB_IDS,
  buildQuestionTabDistribution,
  isPersistedQuestionUuid,
  isQuestionTabId,
  questionAnswerKey,
  resolveTabsFromIds,
  type LessonQuestionTabId,
  type LessonTabId,
  type QuestionTabDistribution,
} from "@/features/content-player/lib/lesson-utils";
import {
  useCompleteStudentAttemptMutation,
  useCompleteStudentSessionMutation,
  useRecordStudentResponseMutation,
  useStartStudentAttemptMutation,
  useStudentLearningSessionQuery,
} from "@/features/student/hooks/use-student-learning-session";
import {
  useGuardianSupervisionContentQuery,
  useSaveStudentProgressMutation,
  useStudentContentQuery,
} from "@/features/student/hooks/use-student-materials";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { STUDENT_HOME_PATH } from "@/lib/auth/portal-paths";
import { BffClientError } from "@/services/bff/client";
import type {
  ActivityAttempt,
  LearningSession,
  LearningSessionKind,
  PlaybackAction,
  StudentProgressUpdateRequest,
} from "@/types/student-learning";

type StudentLessonPlayerProps = {
  contentUuid: string;
  readOnly?: boolean;
  childRef?: string;
  backHref?: string;
  studyTaskUuid?: string;
  sessionKind?: LearningSessionKind;
};

type AnswersByTab = Partial<Record<LessonQuestionTabId, Record<string, string>>>;

function buildActionsMap(
  actions: Record<string, PlaybackAction> | undefined
): Map<string, PlaybackAction> {
  const map = new Map<string, PlaybackAction>();
  if (!actions) return map;
  Object.values(actions).forEach((action) => map.set(action.uuid, action));
  return map;
}

function hydrateAnswers(
  session: LearningSession,
  allowedTabs: ReadonlySet<LessonQuestionTabId>
): AnswersByTab {
  const next: AnswersByTab = {};
  session.responses.forEach((response) => {
    if (!response.selected_option_uuid) return;
    if (!isQuestionTabId(response.tab_id)) return;
    if (!allowedTabs.has(response.tab_id)) return;
    next[response.tab_id] = {
      ...(next[response.tab_id] ?? {}),
      [response.question_uuid]: response.selected_option_uuid,
    };
  });
  return next;
}

function indexAttempts(
  session: LearningSession,
  allowedTabs: ReadonlySet<LessonQuestionTabId>
): Partial<Record<LessonQuestionTabId, ActivityAttempt>> {
  const next: Partial<Record<LessonQuestionTabId, ActivityAttempt>> = {};
  session.attempts.forEach((attempt) => {
    if (!isQuestionTabId(attempt.tab_id)) return;
    if (!allowedTabs.has(attempt.tab_id)) return;
    const current = next[attempt.tab_id];
    if (!current || attempt.attempt_number >= current.attempt_number) {
      next[attempt.tab_id] = attempt;
    }
  });
  return next;
}

function isLessonSession(session: LearningSession | undefined): boolean {
  if (!session?.session_kind) return true;
  return session.session_kind === "new_content";
}

function tabAnswerCount(
  distribution: QuestionTabDistribution,
  answersByTab: AnswersByTab,
  tabId: LessonQuestionTabId
): number {
  const answers = answersByTab[tabId] ?? {};
  return distribution[tabId].reduce((count, question, index) => {
    return answers[questionAnswerKey(question, index)] !== undefined
      ? count + 1
      : count;
  }, 0);
}

function computeProgressPercent(
  distribution: QuestionTabDistribution,
  answersByTab: AnswersByTab,
  pagesCount: number,
  viewedContent: boolean,
  visibleTabIds: LessonTabId[]
): number {
  const units = visibleTabIds.length;
  if (units === 0) return 0;

  let completed = 0;

  visibleTabIds.forEach((tabId) => {
    if (tabId === "treino") {
      if (pagesCount === 0 || viewedContent) completed += 1;
      return;
    }
    const questions = distribution[tabId];
    if (
      questions.length === 0 ||
      tabAnswerCount(distribution, answersByTab, tabId) >= questions.length
    ) {
      completed += 1;
    }
  });

  return Math.min(100, Math.round((completed / units) * 100));
}

function isTabComplete(
  tabId: LessonTabId,
  distribution: QuestionTabDistribution,
  answersByTab: AnswersByTab,
  pagesCount: number,
  viewedContent: boolean
): boolean {
  if (tabId === "treino") {
    return pagesCount === 0 || viewedContent;
  }
  const questions = distribution[tabId];
  if (questions.length === 0) return true;
  return tabAnswerCount(distribution, answersByTab, tabId) >= questions.length;
}

function errorMessage(error: unknown): string {
  return error instanceof BffClientError
    ? (error.detail ?? error.title)
    : getUserFacingApiMessage(error);
}

export function StudentLessonPlayer({
  contentUuid,
  readOnly = false,
  childRef,
  backHref = "/aluno/materiais",
  studyTaskUuid,
  sessionKind,
}: StudentLessonPlayerProps) {
  const studentQuery = useStudentContentQuery(contentUuid, !readOnly);
  const supervisionQuery = useGuardianSupervisionContentQuery(
    childRef ?? "",
    contentUuid,
    readOnly && Boolean(childRef)
  );
  const saveProgress = useSaveStudentProgressMutation(contentUuid);
  const startAttempt = useStartStudentAttemptMutation();
  const completeAttempt = useCompleteStudentAttemptMutation();
  const recordResponse = useRecordStudentResponseMutation();
  const completeSession = useCompleteStudentSessionMutation();
  const router = useRouter();
  const goToKanban = useCallback(() => {
    router.push(STUDENT_HOME_PATH);
  }, [router]);

  const query = readOnly ? supervisionQuery : studentQuery;
  const playback = query.data;

  const sessionQuery = useStudentLearningSessionQuery(
    contentUuid,
    playback?.version.uuid,
    !readOnly && Boolean(playback?.version.uuid),
    readOnly ? undefined : studyTaskUuid,
    readOnly ? undefined : sessionKind
  );
  const session = readOnly ? undefined : sessionQuery.data;

  const [activeTab, setActiveTab] = useState<LessonTabId>("treino");
  const [answersByTab, setAnswersByTab] = useState<AnswersByTab>({});
  const [answersReady, setAnswersReady] = useState(readOnly);
  const [viewedContent, setViewedContent] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [navHint, setNavHint] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [openedAlreadyComplete, setOpenedAlreadyComplete] = useState(false);
  const [completeSummary, setCompleteSummary] = useState<{
    durationSeconds: number;
    percent: number;
  } | null>(null);
  const [runningActionId, setRunningActionId] = useState<string | null>(null);
  const [pendingQuestionKey, setPendingQuestionKey] = useState<string | null>(
    null
  );
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>(
    {}
  );
  const lastSavedAt = useRef<number>(Date.now());
  const visitStartedAt = useRef<number>(Date.now());
  const attemptsByTab = useRef<
    Partial<Record<LessonQuestionTabId, ActivityAttempt>>
  >({});
  const eventUuidByKey = useRef<Record<string, string>>({});
  const sessionResponseCount = useRef(0);
  const answersRef = useRef(answersByTab);
  const entryCompletionLatchedFor = useRef<string | null>(null);
  answersRef.current = answersByTab;

  useEffect(() => {
    setActiveTab("treino");
    setViewedContent(false);
    setDisplayPercent(0);
    setActionError(null);
    setNavHint(null);
    setProgressError(null);
    setSessionError(null);
    setCompletedSuccess(false);
    setOpenedAlreadyComplete(false);
    setCompleteSummary(null);
    entryCompletionLatchedFor.current = null;
    setRunningActionId(null);
    setPendingQuestionKey(null);
    setQuestionErrors({});
    setAnswersReady(readOnly);
    if (readOnly) {
      setAnswersByTab({});
    }
    attemptsByTab.current = {};
    eventUuidByKey.current = {};
    sessionResponseCount.current = 0;
    lastSavedAt.current = Date.now();
    visitStartedAt.current = Date.now();
  }, [contentUuid, readOnly, studyTaskUuid, sessionKind]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const id = "lesson-preview-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = LESSON_PREVIEW_FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  const pages = playback?.version.pages ?? [];
  const questions = playback?.version.questions ?? [];
  const lessonSession = readOnly || isLessonSession(session);

  const distribution = useMemo(
    () => buildQuestionTabDistribution(questions, session?.shuffle_seed),
    [questions, session?.shuffle_seed]
  );

  const visibleTabs = useMemo(() => {
    let tabs;
    if (readOnly) {
      const aulaTabs = resolveTabsFromIds(AULA_TAB_IDS);
      tabs = aulaTabs.filter((tab) => {
        if (tab.id === "treino") return true;
        return distribution[tab.id].length > 0;
      });
    } else if (!session) {
      return [];
    } else if (!Array.isArray(session.visible_tabs)) {
      tabs = resolveTabsFromIds(AULA_TAB_IDS);
    } else {
      tabs = resolveTabsFromIds(session.visible_tabs);
    }

    const includeDesafio =
      distribution.desafio.length > 0 &&
      !tabs.some((tab) => tab.id === "desafio") &&
      (readOnly || isLessonSession(session));

    if (includeDesafio) {
      tabs = [...tabs, ...resolveTabsFromIds(["desafio"])];
    }

    return tabs;
  }, [readOnly, session, distribution]);

  const allowedQuestionTabs = useMemo(() => {
    const allowed = new Set<LessonQuestionTabId>();
    visibleTabs.forEach((tab) => {
      if (isQuestionTabId(tab.id)) allowed.add(tab.id);
    });
    return allowed;
  }, [visibleTabs]);

  const sessionTabsMissing =
    !readOnly && Boolean(session) && visibleTabs.length === 0;

  useEffect(() => {
    if (!readOnly && !session) return;
    if (!lessonSession || !playback) return;
    const saved = playback.material?.progress.percent_complete ?? 0;
    setDisplayPercent((current) => Math.max(current, saved));
    if (entryCompletionLatchedFor.current === contentUuid) return;
    entryCompletionLatchedFor.current = contentUuid;
    if (playback.material?.progress.status === "completed" || saved >= 100) {
      setOpenedAlreadyComplete(true);
      setViewedContent(true);
    }
  }, [
    contentUuid,
    lessonSession,
    playback,
    readOnly,
    session,
    playback?.material?.progress.percent_complete,
    playback?.material?.progress.status,
  ]);

  useEffect(() => {
    if (readOnly || !session) return;
    setAnswersByTab(hydrateAnswers(session, allowedQuestionTabs));
    attemptsByTab.current = indexAttempts(session, allowedQuestionTabs);
    sessionResponseCount.current = session.responses.filter((response) =>
      allowedQuestionTabs.has(response.tab_id)
    ).length;
    eventUuidByKey.current = {};
    session.responses.forEach((response) => {
      const attempt = attemptsByTab.current[response.tab_id];
      if (!attempt) return;
      eventUuidByKey.current[`${attempt.uuid}:${response.question_uuid}`] =
        response.uuid;
    });
    setAnswersReady(true);
    setSessionError(null);
  }, [readOnly, session, allowedQuestionTabs]);

  useEffect(() => {
    if (readOnly) {
      setSessionError(null);
      return;
    }
    if (sessionQuery.isError) {
      setSessionError(errorMessage(sessionQuery.error));
      setAnswersReady(true);
    }
  }, [readOnly, sessionQuery.isError, sessionQuery.error]);


  const visibleTabIds = useMemo(
    () => visibleTabs.map((tab) => tab.id),
    [visibleTabs]
  );

  const actionsByUuid = useMemo(
    () => buildActionsMap(playback?.actions),
    [playback?.actions]
  );

  const primaryPage = pages[0];
  const kicker = useMemo(() => {
    if (!playback) return "";
    return [playback.content.subject?.name, playback.content.series?.name]
      .filter(Boolean)
      .join(" · ");
  }, [playback]);

  const footerTrace = useMemo(() => {
    if (!playback) return "";
    const code = playback.content.topic?.code;
    if (code) {
      return `Rastreabilidade: ${code} · Material de estudo — uso pedagógico.`;
    }
    return "Material de estudo — uso pedagógico.";
  }, [playback]);

  const activeTabMeta = visibleTabs.find((tab) => tab.id === activeTab);
  const activeTabIndex = visibleTabIds.indexOf(activeTab);
  const isFirstTab = activeTabIndex <= 0;
  const isLastTab =
    activeTabIndex >= 0 && activeTabIndex === visibleTabIds.length - 1;
  const isSavingProgress =
    saveProgress.isPending || completeSession.isPending;

  const localPercent = useMemo(
    () =>
      computeProgressPercent(
        distribution,
        answersByTab,
        pages.length,
        viewedContent || activeTab === "treino",
        visibleTabIds
      ),
    [
      distribution,
      answersByTab,
      pages.length,
      viewedContent,
      activeTab,
      visibleTabIds,
    ]
  );

  const shownPercent = lessonSession
    ? Math.max(displayPercent, localPercent)
    : localPercent;

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab) && visibleTabs[0]) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  async function ensureAttempt(
    tabId: LessonQuestionTabId
  ): Promise<ActivityAttempt | null> {
    if (readOnly || !session || sessionTabsMissing) return null;
    if (!allowedQuestionTabs.has(tabId)) {
      setProgressError("Esta etapa não faz parte da sessão atual.");
      return null;
    }
    const existing = attemptsByTab.current[tabId];
    if (existing && existing.status !== "abandoned") return existing;

    try {
      const attempt = await startAttempt.mutateAsync({
        sessionUuid: session.uuid,
        body: { tab_id: tabId },
      });
      attemptsByTab.current[tabId] = attempt;
      return attempt;
    } catch (error) {
      setProgressError(errorMessage(error));
      return null;
    }
  }

  async function completeAttemptIfReady(tabId: LessonTabId): Promise<void> {
    if (readOnly || !isQuestionTabId(tabId)) return;
    const attempt = attemptsByTab.current[tabId];
    if (!attempt || attempt.status === "completed") return;
    if (
      !isTabComplete(
        tabId,
        distribution,
        answersRef.current,
        pages.length,
        true
      )
    ) {
      return;
    }

    try {
      const updated = await completeAttempt.mutateAsync({
        attemptUuid: attempt.uuid,
        body: { status: "completed" },
      });
      attemptsByTab.current[tabId] = updated;
    } catch {
      completeAttempt.mutate({
        attemptUuid: attempt.uuid,
        body: { status: "completed" },
      });
    }
  }

  useEffect(() => {
    if (readOnly || !session || sessionTabsMissing) return;
    if (!isQuestionTabId(activeTab) || !allowedQuestionTabs.has(activeTab)) {
      return;
    }
    void ensureAttempt(activeTab);
    // persist/attempt helpers close over latest session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, session?.uuid, activeTab, sessionTabsMissing]);

  function consumeTimeDelta(): number {
    const now = Date.now();
    const delta = Math.max(0, Math.floor((now - lastSavedAt.current) / 1000));
    lastSavedAt.current = now;
    return Math.min(delta, 86400);
  }

  async function persistProgress(options: {
    nextAnswers?: AnswersByTab;
    contentViewed?: boolean;
    nextTabIndex?: number;
    markCompleted?: boolean;
  }): Promise<boolean> {
    if (readOnly || !playback) return true;

    const nextAnswers = options.nextAnswers ?? answersByTab;
    const contentViewed =
      options.contentViewed ?? (viewedContent || activeTab === "treino");
    const sessionPercent = computeProgressPercent(
      distribution,
      nextAnswers,
      pages.length,
      contentViewed,
      visibleTabIds
    );
    const percent = lessonSession
      ? options.markCompleted
        ? 100
        : sessionPercent
      : undefined;

    const body: StudentProgressUpdateRequest = {
      content_version_uuid: playback.version.uuid,
      last_page_index: Math.max(0, options.nextTabIndex ?? activeTabIndex),
      time_studied_seconds_delta: consumeTimeDelta(),
      mark_completed: lessonSession
        ? (options.markCompleted ?? (percent ?? 0) >= 100)
        : false,
      metadata: {
        active_tab: activeTab,
        visible_tabs: visibleTabIds,
      },
    };
    if (percent !== undefined) {
      body.percent_complete = percent;
    }

    try {
      setProgressError(null);
      const result = await saveProgress.mutateAsync(body);
      if (lessonSession) {
        setDisplayPercent((current) =>
          Math.max(current, result.percent_complete, percent ?? 0)
        );
        if (result.status === "completed" || result.percent_complete >= 100) {
          setCompletedSuccess(true);
        }
      }
      return true;
    } catch (error) {
      setProgressError(errorMessage(error));
      return false;
    }
  }

  function handleTabChange(tabId: LessonTabId) {
    if (isSavingProgress) return;
    if (isQuestionTabId(activeTab) && activeTab !== tabId) {
      void completeAttemptIfReady(activeTab);
    }
    setActiveTab(tabId);
    setActionError(null);
    setNavHint(null);
    if (tabId === "treino") {
      setViewedContent(true);
    }
  }

  async function handleAnswer(
    tabId: LessonQuestionTabId,
    questionKey: string,
    optionKey: string,
    responseTimeMs: number
  ) {
    if (readOnly || pendingQuestionKey) return;
    if (!allowedQuestionTabs.has(tabId)) return;
    const tabAnswers = answersByTab[tabId] ?? {};
    if (tabAnswers[questionKey] !== undefined) return;

    const canPersist =
      Boolean(session) &&
      isPersistedQuestionUuid(questionKey) &&
      isPersistedQuestionUuid(optionKey);

    if (!canPersist) {
      setNavHint(null);
      setAnswersByTab((current) => ({
        ...current,
        [tabId]: { ...(current[tabId] ?? {}), [questionKey]: optionKey },
      }));
      return;
    }

    const attempt = await ensureAttempt(tabId);
    if (!attempt || !session) {
      setQuestionErrors((current) => ({
        ...current,
        [questionKey]: "Não foi possível registrar a resposta. Tente de novo.",
      }));
      return;
    }

    const eventKey = `${attempt.uuid}:${questionKey}`;
    if (!eventUuidByKey.current[eventKey]) {
      eventUuidByKey.current[eventKey] = crypto.randomUUID();
    }

    setPendingQuestionKey(questionKey);
    setQuestionErrors((current) => {
      const next = { ...current };
      delete next[questionKey];
      return next;
    });

    try {
      await recordResponse.mutateAsync({
        attemptUuid: attempt.uuid,
        body: {
          event_uuid: eventUuidByKey.current[eventKey],
          question_uuid: questionKey,
          selected_option_uuid: optionKey,
          response_time_ms: responseTimeMs,
          sequence_in_attempt: Object.keys(tabAnswers).length + 1,
          sequence_in_session: sessionResponseCount.current + 1,
          hint_used: false,
          attempted_at: new Date().toISOString(),
        },
      });
      sessionResponseCount.current += 1;
      setNavHint(null);
      setAnswersByTab((current) => ({
        ...current,
        [tabId]: { ...(current[tabId] ?? {}), [questionKey]: optionKey },
      }));
    } catch (error) {
      setQuestionErrors((current) => ({
        ...current,
        [questionKey]: errorMessage(error),
      }));
    } finally {
      setPendingQuestionKey(null);
    }
  }

  async function handleContinue() {
    if (isSavingProgress || !playback) return;

    if (activeTab === "treino") {
      setViewedContent(true);
    }

    const contentViewed = activeTab === "treino" ? true : viewedContent;
    const canAdvance =
      readOnly ||
      isTabComplete(
        activeTab,
        distribution,
        answersByTab,
        pages.length,
        contentViewed
      );

    if (!canAdvance) {
      setNavHint(
        "Responda todas as questões desta etapa antes de continuar."
      );
      return;
    }

    if (isLastTab) return;

    const nextIndex = activeTabIndex + 1;
    const nextTab = visibleTabIds[nextIndex];
    if (!nextTab) return;

    if (!readOnly) {
      if (isQuestionTabId(activeTab)) {
        void completeAttemptIfReady(activeTab);
      }
      const ok = await persistProgress({
        contentViewed,
        nextTabIndex: nextIndex,
      });
      if (!ok) return;
    }

    setActiveTab(nextTab);
    setNavHint(null);
    setActionError(null);
  }

  async function handleComplete() {
    if (readOnly || isSavingProgress || !playback) return;

    if (activeTab === "treino") {
      setViewedContent(true);
    }

    const contentViewed = true;
    const canComplete = visibleTabIds.every((tabId) =>
      isTabComplete(
        tabId,
        distribution,
        answersByTab,
        pages.length,
        contentViewed
      )
    );

    if (!canComplete) {
      setNavHint(
        lessonSession
          ? "Conclua o conteúdo e responda as questões das etapas antes de finalizar."
          : "Responda as questões desta etapa antes de finalizar."
      );
      return;
    }

    if (isQuestionTabId(activeTab)) {
      await completeAttemptIfReady(activeTab);
    }

    const ok = await persistProgress({
      contentViewed,
      nextTabIndex: activeTabIndex,
      markCompleted: lessonSession,
    });
    if (!ok) return;

    if (session) {
      try {
        await completeSession.mutateAsync({
          sessionUuid: session.uuid,
          body: { status: "completed" },
        });
      } catch (error) {
        setProgressError(errorMessage(error));
      }
    }

    setCompletedSuccess(true);
    setCompleteSummary({
      durationSeconds: Math.max(
        1,
        Math.floor((Date.now() - visitStartedAt.current) / 1000)
      ),
      percent: shownPercent,
    });
    setNavHint(null);
  }

  function leaveLesson() {
    router.push(backHref);
  }

  function handlePrevious() {
    if (isSavingProgress || isFirstTab) return;
    const prevTab = visibleTabIds[activeTabIndex - 1];
    if (!prevTab) return;
    if (isQuestionTabId(activeTab)) {
      void completeAttemptIfReady(activeTab);
    }
    setActiveTab(prevTab);
    setNavHint(null);
    setActionError(null);
  }

  const exitLabel = studyTaskUuid ? "Voltar ao quadro" : "Voltar aos materiais";

  if (query.isLoading) {
    return (
      <div className="lesson-player" role="status">
        <div className="lesson-player__card">
          <div className="lesson-player__status">
            <Link
              href={backHref}
              className="lesson-player__exit lesson-player__exit--solid"
            >
              {exitLabel}
            </Link>
            <p>Carregando conteúdo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (query.error || !playback) {
    return (
      <div className="lesson-player">
        <div className="lesson-player__card">
          <div className="lesson-player__status">
            <Link
              href={backHref}
              className="lesson-player__exit lesson-player__exit--solid"
            >
              {exitLabel}
            </Link>
            <div className="alert alert-danger" role="alert">
              {errorMessage(query.error)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showCompletedNotice =
    (openedAlreadyComplete || completedSuccess) && !completeSummary;
  const hasLesson =
    pages.length > 0 || questions.length > 0 || visibleTabs.length > 0;
  const waitingForSession =
    !readOnly && !sessionQuery.isError && (!session || !answersReady);
  const waitingSession =
    waitingForSession &&
    (isQuestionTabId(activeTab) || visibleTabs.length === 0);

  return (
    <div className="lesson-player">
      {completeSummary ? (
        <StudentSessionCompleteDialog
          title="Parabéns!"
          message={
            lessonSession
              ? "Você concluiu esta aula. Que orgulho do seu esforço!"
              : "Você concluiu esta revisão. Que orgulho do seu esforço!"
          }
          durationLabel={formatSessionDuration(completeSummary.durationSeconds)}
          percentLabel={`${completeSummary.percent}%`}
          onConfirm={goToKanban}
        />
      ) : null}

      {sessionTabsMissing ? (
        <div className="lesson-player__card">
          <div className="lesson-player__status">
            <Link
              href={backHref}
              className="lesson-player__exit lesson-player__exit--solid"
            >
              {exitLabel}
            </Link>
            <div className="alert alert-danger mb-0" role="alert">
              Esta etapa de estudo não está disponível no momento. Tente de novo
              mais tarde.
            </div>
          </div>
        </div>
      ) : !hasLesson && !waitingForSession ? (
        <div className="lesson-player__card">
          <div className="lesson-player__status">
            <Link
              href={backHref}
              className="lesson-player__exit lesson-player__exit--solid"
            >
              {exitLabel}
            </Link>
            <p className="lesson-player__empty">
              Nenhum conteúdo pedagógico disponível. Preencha o material ou as
              questões.
            </p>
          </div>
        </div>
      ) : (
        <div className="lesson-player__card">
            <header className="lesson-player__header">
              <div className="lesson-player__header-row">
                <div className="lesson-player__header-copy">
                  {kicker ? (
                    <p className="lesson-player__kicker">{kicker}</p>
                  ) : null}
                  <h1 className="lesson-player__title">
                    {primaryPage?.title || playback.content.name}
                  </h1>
                  {primaryPage?.text ? (
                    <p className="lesson-player__subtitle">
                      {primaryPage.text.replace(/<[^>]+>/g, "").slice(0, 160)}
                    </p>
                  ) : null}
                </div>
              </div>
            </header>

            {readOnly ? (
              <div className="lesson-player__notice">
                <div className="alert alert-info mb-0" role="status">
                  Visualização somente leitura — atividades desabilitadas.
                </div>
              </div>
            ) : null}

            {showCompletedNotice ? (
              <div className="lesson-player__notice">
                <div className="alert alert-success mb-0" role="status">
                  {lessonSession
                    ? "Material concluído! Seu progresso foi registrado."
                    : "Etapa concluída! Seu progresso foi registrado."}
                </div>
              </div>
            ) : null}

            {sessionError ? (
              <div className="lesson-player__notice">
                <div className="alert alert-warning mb-0" role="status">
                  Não foi possível iniciar o registro das respostas. {sessionError}
                </div>
              </div>
            ) : null}

            {progressError ? (
              <div className="lesson-player__notice">
                <div className="alert alert-danger mb-0" role="alert">
                  {progressError}
                </div>
              </div>
            ) : null}

            <div className="lesson-player__progress-wrap">
              <div className="lesson-player__progress-meta">
                <span>
                  Etapa: <strong>{activeTabMeta?.label ?? "Estudo"}</strong>
                </span>
                <strong>{shownPercent}%</strong>
              </div>
              <div className="progress" aria-label="Progresso da lição">
                <div
                  className="progress-bar"
                  style={{ width: `${shownPercent}%` }}
                />
              </div>
            </div>

            <nav
              className="lesson-player__tabs"
              role="tablist"
              aria-label="Abas da lição"
            >
              {visibleTabs.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    className={`lesson-player__tab${selected ? " is-active" : ""}`}
                    disabled={isSavingProgress}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <main className="lesson-player__main">
              {navHint ? (
                <p className="lesson-player__hint" role="status">
                  {navHint}
                </p>
              ) : null}

              {activeTab === "treino" ? (
                <LessonContentTab
                  pages={pages}
                  actionsByUuid={actionsByUuid}
                  onActionError={setActionError}
                  runningActionId={runningActionId}
                  onRunningActionChange={setRunningActionId}
                  readOnly={readOnly}
                />
              ) : null}

              {waitingSession ? (
                <p role="status">Carregando etapa de estudo...</p>
              ) : null}

              {isQuestionTabId(activeTab) &&
              activeTabMeta &&
              !waitingSession ? (
                <LessonQuestionsTab
                  tab={activeTabMeta}
                  questions={distribution[activeTab]}
                  answers={answersByTab[activeTab] ?? {}}
                  pendingQuestionKey={pendingQuestionKey}
                  questionErrors={questionErrors}
                  onAnswer={(questionKey, optionKey, responseTimeMs) => {
                    void handleAnswer(
                      activeTab,
                      questionKey,
                      optionKey,
                      responseTimeMs
                    );
                  }}
                  readOnly={readOnly}
                />
              ) : null}

              {actionError ? (
                <p className="text-danger text-center mt-3 mb-0" role="alert">
                  {actionError}
                </p>
              ) : null}
            </main>

            <div className="lesson-player__nav">
              <div className="lesson-player__nav-leading">
                <Link href={backHref} className="lesson-player__exit">
                  {exitLabel}
                </Link>
                <button
                  type="button"
                  className="vs-btn style3"
                  onClick={handlePrevious}
                  disabled={isFirstTab || isSavingProgress || waitingForSession}
                >
                  Anterior
                </button>
              </div>

              <div className="lesson-player__nav-actions">
                {!isLastTab ? (
                  <button
                    type="button"
                    className="vs-btn"
                    onClick={() => void handleContinue()}
                    disabled={isSavingProgress || waitingForSession}
                  >
                    {isSavingProgress ? "Salvando..." : "Continuar"}
                  </button>
                ) : null}

                {isLastTab && openedAlreadyComplete ? (
                  <button
                    type="button"
                    className="vs-btn"
                    onClick={leaveLesson}
                    disabled={isSavingProgress}
                  >
                    Continuar
                  </button>
                ) : null}

                {isLastTab && !openedAlreadyComplete && !readOnly ? (
                  <button
                    type="button"
                    className="vs-btn"
                    onClick={() => void handleComplete()}
                    disabled={isSavingProgress || waitingForSession}
                  >
                    {isSavingProgress
                      ? "Salvando..."
                      : lessonSession
                        ? "Concluir material"
                        : "Concluir etapa"}
                  </button>
                ) : null}

                {isLastTab && !openedAlreadyComplete && readOnly ? (
                  <Link href={backHref} className="vs-btn">
                    Continuar
                  </Link>
                ) : null}
              </div>
            </div>

            <footer className="lesson-player__footer">{footerTrace}</footer>
          </div>
      )}
    </div>
  );
}
