"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { LessonContentTab } from "@/features/content-player/components/lesson-content-tab";
import { LessonQuestionsTab } from "@/features/content-player/components/lesson-questions-tab";
import {
  buildQuestionTabDistribution,
  isQuestionTabId,
  resolveVisibleTabs,
  type LessonQuestionTabId,
  type LessonTabId,
  type QuestionTabDistribution,
} from "@/features/content-player/lib/lesson-utils";
import {
  useGuardianSupervisionContentQuery,
  useSaveStudentProgressMutation,
  useStudentContentQuery,
} from "@/features/student/hooks/use-student-materials";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type {
  PlaybackAction,
  StudentProgressUpdateRequest,
} from "@/types/student-learning";

type StudentLessonPlayerProps = {
  contentUuid: string;
  readOnly?: boolean;
  childRef?: string;
  backHref?: string;
};

type AnswersByTab = Partial<
  Record<LessonQuestionTabId, Record<number, number>>
>;

function buildActionsMap(
  actions: Record<string, PlaybackAction> | undefined
): Map<string, PlaybackAction> {
  const map = new Map<string, PlaybackAction>();
  if (!actions) return map;
  Object.values(actions).forEach((action) => map.set(action.uuid, action));
  return map;
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
    const answers = answersByTab[tabId] ?? {};
    if (questions.length === 0 || Object.keys(answers).length >= questions.length) {
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
  return Object.keys(answersByTab[tabId] ?? {}).length >= questions.length;
}

export function StudentLessonPlayer({
  contentUuid,
  readOnly = false,
  childRef,
  backHref = "/aluno/materiais",
}: StudentLessonPlayerProps) {
  const studentQuery = useStudentContentQuery(contentUuid, !readOnly);
  const supervisionQuery = useGuardianSupervisionContentQuery(
    childRef ?? "",
    contentUuid,
    readOnly && Boolean(childRef)
  );
  const saveProgress = useSaveStudentProgressMutation(contentUuid);

  const query = readOnly ? supervisionQuery : studentQuery;
  const playback = query.data;

  const [activeTab, setActiveTab] = useState<LessonTabId>("treino");
  const [answersByTab, setAnswersByTab] = useState<AnswersByTab>({});
  const [viewedContent, setViewedContent] = useState(false);
  const [displayPercent, setDisplayPercent] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [navHint, setNavHint] = useState<string | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [completedSuccess, setCompletedSuccess] = useState(false);
  const [runningActionId, setRunningActionId] = useState<string | null>(null);
  const lastSavedAt = useRef<number>(Date.now());

  useEffect(() => {
    setActiveTab("treino");
    setAnswersByTab({});
    setViewedContent(false);
    setDisplayPercent(0);
    setActionError(null);
    setNavHint(null);
    setProgressError(null);
    setCompletedSuccess(false);
    setRunningActionId(null);
    lastSavedAt.current = Date.now();
  }, [contentUuid]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const saved = playback?.material?.progress.percent_complete ?? 0;
    setDisplayPercent((current) => Math.max(current, saved));
    if (playback?.material?.progress.status === "completed" || saved >= 100) {
      setCompletedSuccess(true);
      setViewedContent(true);
    }
  }, [playback?.material?.progress.percent_complete, playback?.material?.progress.status]);

  const pages = playback?.version.pages ?? [];
  const questions = playback?.version.questions ?? [];

  const distribution = useMemo(
    () => buildQuestionTabDistribution(questions),
    [questions]
  );

  const visibleTabs = useMemo(
    () => resolveVisibleTabs(pages.length, distribution),
    [pages.length, distribution]
  );

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
  const isSaving = saveProgress.isPending;

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

  const shownPercent = Math.max(displayPercent, localPercent);

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab) && visibleTabs[0]) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

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
    const percent = options.markCompleted
      ? 100
      : computeProgressPercent(
          distribution,
          nextAnswers,
          pages.length,
          contentViewed,
          visibleTabIds
        );

    const body: StudentProgressUpdateRequest = {
      content_version_uuid: playback.version.uuid,
      last_page_index: Math.max(0, options.nextTabIndex ?? activeTabIndex),
      percent_complete: percent,
      time_studied_seconds_delta: consumeTimeDelta(),
      mark_completed: options.markCompleted ?? percent >= 100,
      metadata: {
        active_tab: activeTab,
        visible_tabs: visibleTabIds,
      },
    };

    try {
      setProgressError(null);
      const result = await saveProgress.mutateAsync(body);
      setDisplayPercent((current) =>
        Math.max(current, result.percent_complete, percent)
      );
      if (result.status === "completed" || result.percent_complete >= 100) {
        setCompletedSuccess(true);
      }
      return true;
    } catch (error) {
      setProgressError(
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : getUserFacingApiMessage(error)
      );
      return false;
    }
  }

  function handleTabChange(tabId: LessonTabId) {
    if (isSaving) return;
    setActiveTab(tabId);
    setActionError(null);
    setNavHint(null);
    if (tabId === "treino") {
      setViewedContent(true);
    }
  }

  function handleAnswer(
    tabId: LessonQuestionTabId,
    questionIndex: number,
    optionIndex: number
  ) {
    if (readOnly || isSaving) return;

    setAnswersByTab((current) => {
      const tabAnswers = current[tabId] ?? {};
      if (tabAnswers[questionIndex] !== undefined) return current;
      setNavHint(null);
      return {
        ...current,
        [tabId]: { ...tabAnswers, [questionIndex]: optionIndex },
      };
    });
  }

  async function handleContinue() {
    if (isSaving || !playback) return;

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
    if (readOnly || isSaving || !playback) return;

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
        "Conclua o conteúdo e responda as questões das etapas antes de finalizar."
      );
      return;
    }

    const ok = await persistProgress({
      contentViewed,
      nextTabIndex: activeTabIndex,
      markCompleted: true,
    });
    if (!ok) return;

    setCompletedSuccess(true);
    setNavHint(null);
  }

  function handlePrevious() {
    if (isSaving || isFirstTab) return;
    const prevTab = visibleTabIds[activeTabIndex - 1];
    if (!prevTab) return;
    setActiveTab(prevTab);
    setNavHint(null);
    setActionError(null);
  }

  if (query.isLoading) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando conteúdo...</p>
      </div>
    );
  }

  if (query.error || !playback) {
    return (
      <div className="blog-content">
        <div className="alert alert-danger" role="alert">
          {query.error instanceof BffClientError
            ? (query.error.detail ?? query.error.title)
            : getUserFacingApiMessage(query.error)}
        </div>
        <Link href={backHref} className="vs-btn">
          Voltar
        </Link>
      </div>
    );
  }

  const hasLesson =
    pages.length > 0 || questions.length > 0 || visibleTabs.length > 0;

  return (
    <div className="blog-content">
      {readOnly ? (
        <div className="alert alert-info mb-4" role="status">
          Visualização somente leitura — atividades desabilitadas.
        </div>
      ) : null}

      <div className="mb-3">
        <Link href={backHref} className="vs-btn style3">
          Voltar aos materiais
        </Link>
      </div>

      {completedSuccess ? (
        <div className="alert alert-success mb-4" role="status">
          Material concluído! Seu progresso foi registrado.
        </div>
      ) : null}

      {progressError ? (
        <div className="alert alert-danger mb-4" role="alert">
          {progressError}
        </div>
      ) : null}

      {!hasLesson ? (
        <p className="lesson-player__empty">
          Nenhum conteúdo pedagógico disponível. Preencha o material ou as
          questões.
        </p>
      ) : (
        <div className="lesson-player">
          <div className="lesson-player__card">
            <header className="lesson-player__header">
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
            </header>

            <div className="lesson-player__progress-wrap">
              <div className="lesson-player__progress-meta">
                <span>
                  Etapa: <strong>{activeTabMeta?.label ?? "Conteúdo"}</strong>
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
                    disabled={isSaving}
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

              {isQuestionTabId(activeTab) && activeTabMeta ? (
                <LessonQuestionsTab
                  tab={activeTabMeta}
                  questions={distribution[activeTab]}
                  answers={answersByTab[activeTab] ?? {}}
                  onAnswer={(questionIndex, optionIndex) =>
                    handleAnswer(activeTab, questionIndex, optionIndex)
                  }
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
              <button
                type="button"
                className="vs-btn style3"
                onClick={handlePrevious}
                disabled={isFirstTab || isSaving}
              >
                Anterior
              </button>

              <div className="lesson-player__nav-actions">
                {!isLastTab ? (
                  <button
                    type="button"
                    className="vs-btn"
                    onClick={() => void handleContinue()}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Continuar"}
                  </button>
                ) : null}

                {isLastTab && !readOnly ? (
                  <button
                    type="button"
                    className="vs-btn"
                    onClick={() => void handleComplete()}
                    disabled={isSaving || completedSuccess}
                  >
                    {isSaving
                      ? "Salvando..."
                      : completedSuccess
                        ? "Concluído"
                        : "Concluir material"}
                  </button>
                ) : null}

                {isLastTab && readOnly ? (
                  <Link href={backHref} className="vs-btn">
                    Voltar aos materiais
                  </Link>
                ) : null}
              </div>
            </div>

            <footer className="lesson-player__footer">{footerTrace}</footer>
          </div>
        </div>
      )}

      {completedSuccess ? (
        <div className="mt-4">
          <Link href={backHref} className="vs-btn">
            Voltar aos materiais
          </Link>
        </div>
      ) : null}
    </div>
  );
}
