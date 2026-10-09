"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { catalogFromLearning } from "@/features/study-planner/lib/catalog";
import {
  addCalendarDays,
  fortalezaTodayYmd,
  REVIEW_MODEL_LABELS,
  reviewModelForForm,
} from "@/features/study-planner/lib/labels";
import { isSchoolWeekday, WEEKDAYS } from "@/features/study-planner/lib/weekdays";
import {
  guardianStudyPlannerSchema,
  type GuardianStudyPlannerValues,
} from "@/features/study-planner/schemas/planner.schema";
import { SchoolScheduleWeek } from "@/features/study-planner/components/school-schedule-week";
import { StudyPlanHistory } from "@/features/study-planner/components/study-plan-history";
import { StudyPlanResult } from "@/features/study-planner/components/study-plan-result";
import { StudyKanbanBoard } from "@/features/study-kanban/components/study-kanban-board";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { useChildrenQuery } from "@/services/queries/children.queries";
import {
  useGenerateStudyPlanMutation,
  useSaveGuardianAvailabilityMutation,
  useSaveGuardianSchoolScheduleMutation,
  useSaveGuardianStudySettingsMutation,
} from "@/services/queries/guardian-study-planner.mutations";
import {
  useGuardianAvailabilityQuery,
  useGuardianChildBoardQuery,
  useGuardianChildLearningCatalogQuery,
  useGuardianCurrentStudyPlanQuery,
  useGuardianSchoolScheduleQuery,
  useGuardianStudyPlanPollQuery,
  useGuardianStudySettingsQuery,
  useGuardianSubjectsQuery,
} from "@/services/queries/guardian-study-planner.queries";
import type { StudyPlanDetail } from "@/types/guardian-study-planner";

type GuardianStudyPlannerViewProps = {
  childRef: string;
};

const FOCUS_STUDY_BOARD_KEY = "akili-focus-study-board";

function fieldMessage(
  error: { message?: string } | undefined
): string | null {
  return error?.message ?? null;
}

function reloadWithStudyBoardAtTop() {
  try {
    sessionStorage.setItem(FOCUS_STUDY_BOARD_KEY, "1");
  } catch {
    // O recarregamento segue mesmo se o navegador bloquear o armazenamento.
  }
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.location.reload();
}

function scrollStudyBoardIntoView() {
  const board = document.getElementById("quadro");
  if (!board) return false;

  const header = document.querySelector(".sticky-active");
  const offset =
    header instanceof HTMLElement ? header.getBoundingClientRect().height + 12 : 0;
  const top = board.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
  return true;
}

export function GuardianStudyPlannerView({
  childRef,
}: GuardianStudyPlannerViewProps) {
  const { user, setActiveChildRef } = useSession();
  const childrenQuery = useChildrenQuery();
  const children = childrenQuery.data ?? user?.children ?? [];
  const child = children.find((item) => item.ref === childRef);
  const canViewProgress = child?.canViewProgress ?? false;

  const boardQuery = useGuardianChildBoardQuery(childRef, canViewProgress);
  const settingsQuery = useGuardianStudySettingsQuery(childRef, canViewProgress);
  const availabilityQuery = useGuardianAvailabilityQuery(childRef, canViewProgress);
  const scheduleQuery = useGuardianSchoolScheduleQuery(childRef, canViewProgress);
  const currentPlanQuery = useGuardianCurrentStudyPlanQuery(childRef, canViewProgress);
  const learningQuery = useGuardianChildLearningCatalogQuery(childRef, canViewProgress);
  const subjectsQuery = useGuardianSubjectsQuery(canViewProgress);

  const saveSettings = useSaveGuardianStudySettingsMutation(childRef);
  const saveAvailability = useSaveGuardianAvailabilityMutation(childRef);
  const saveSchedule = useSaveGuardianSchoolScheduleMutation(childRef);
  const generatePlan = useGenerateStudyPlanMutation(childRef);

  const [pollUuid, setPollUuid] = useState<string | null>(null);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const [formAlert, setFormAlert] = useState<string | null>(null);
  const hydratedRef = useRef(false);
  const reloadingRef = useRef(false);

  const pollQuery = useGuardianStudyPlanPollQuery(childRef, pollUuid);
  const catalog = useMemo(
    () => catalogFromLearning(learningQuery.data),
    [learningQuery.data]
  );
  const subjects = subjectsQuery.data ?? [];
  const subjectNames = useMemo(() => {
    const names = new Map<string, string>();
    for (const subject of subjects) {
      names.set(subject.uuid, subject.name);
    }
    for (const slot of scheduleQuery.data?.items ?? []) {
      if (slot.subject_name && !names.has(slot.subject_uuid)) {
        names.set(slot.subject_uuid, slot.subject_name);
      }
    }
    return names;
  }, [scheduleQuery.data, subjects]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<GuardianStudyPlannerValues>({
    resolver: zodResolver(guardianStudyPlannerSchema),
    defaultValues: {
      inverted_classroom: false,
      spaced_review: true,
      review_model: "dehaene",
      items_per_session: "",
      tdah_adjustment: false,
      on_medication: false,
      availability: [],
      school_schedule: [],
      starts_on: fortalezaTodayYmd(),
      content_deadline_on: addCalendarDays(fortalezaTodayYmd(), 40),
      blocked_dates: [],
      exams: [],
      topics: [],
    },
  });

  const availabilityFields = useFieldArray({ control, name: "availability" });
  const scheduleFields = useFieldArray({ control, name: "school_schedule" });
  const examFields = useFieldArray({ control, name: "exams" });
  const topics = watch("topics");
  const blockedDates = watch("blocked_dates");

  useEffect(() => {
    if (child?.ref) setActiveChildRef(child.ref);
  }, [child?.ref, setActiveChildRef]);

  useEffect(() => {
    if (hydratedRef.current) return;
    if (!settingsQuery.data || !availabilityQuery.data || !scheduleQuery.data) {
      return;
    }
    if (learningQuery.isLoading) return;

    const today = fortalezaTodayYmd();
    const current = currentPlanQuery.data;
    hydratedRef.current = true;
    reset({
      inverted_classroom: settingsQuery.data.inverted_classroom,
      spaced_review: settingsQuery.data.spaced_review,
      review_model: reviewModelForForm(settingsQuery.data.review_model),
      items_per_session:
        settingsQuery.data.items_per_session == null
          ? ""
          : settingsQuery.data.items_per_session,
      tdah_adjustment: settingsQuery.data.tdah_adjustment,
      on_medication: settingsQuery.data.on_medication,
      availability: availabilityQuery.data.items.map((slot) => ({
        weekday: slot.weekday,
        starts_at: slot.starts_at.slice(0, 5),
        ends_at: slot.ends_at.slice(0, 5),
        is_recurring: slot.is_recurring,
      })),
      school_schedule: scheduleQuery.data.items
        .filter((slot) => isSchoolWeekday(slot.weekday))
        .map((slot) => ({
          weekday: slot.weekday,
          subject_uuid: slot.subject_uuid,
        })),
      starts_on: current?.starts_on ?? today,
      content_deadline_on:
        current?.content_deadline_on ?? addCalendarDays(today, 40),
      blocked_dates: current?.blocked_dates ?? [],
      exams: (current?.exams ?? []).map((exam) => ({
        date: exam.date,
        subject_uuid: exam.subject_uuids[0] ?? "",
      })),
      topics: catalog.topics.map((topic) => ({
        topic_uuid: topic.uuid,
        name: topic.subjectName ? `${topic.name} · ${topic.subjectName}` : topic.name,
        selected: true,
        difficulty_level: "N3",
        needs_reinforcement: false,
      })),
    });
  }, [
    availabilityQuery.data,
    catalog.topics,
    currentPlanQuery.data,
    learningQuery.isLoading,
    reset,
    scheduleQuery.data,
    settingsQuery.data,
  ]);

  const displayedPlan: StudyPlanDetail | null =
    pollQuery.data ?? currentPlanQuery.data ?? null;

  useEffect(() => {
    if (!pollUuid) return;
    setPollTimedOut(false);
    const timer = window.setTimeout(() => setPollTimedOut(true), 90_000);
    return () => window.clearTimeout(timer);
  }, [pollUuid]);

  useEffect(() => {
    if (!pollUuid || reloadingRef.current) return;
    if (pollQuery.data?.status !== "applied") return;
    reloadingRef.current = true;
    reloadWithStudyBoardAtTop();
  }, [pollQuery.data?.status, pollUuid]);

  const focusCreatedBoard =
    Boolean(child) &&
    canViewProgress &&
    Boolean(settingsQuery.data) &&
    displayedPlan?.status === "applied";

  useEffect(() => {
    if (!focusCreatedBoard) return;
    let pending = false;
    try {
      pending = sessionStorage.getItem(FOCUS_STUDY_BOARD_KEY) === "1";
    } catch {
      return;
    }
    if (!pending) return;
    if (!scrollStudyBoardIntoView()) return;
    try {
      sessionStorage.removeItem(FOCUS_STUDY_BOARD_KEY);
    } catch {
      // A rolagem já aconteceu.
    }
  }, [focusCreatedBoard]);
  const isGenerating =
    displayedPlan?.status === "pending" || displayedPlan?.status === "generating";
  const isSaving =
    saveSettings.isPending ||
    saveAvailability.isPending ||
    saveSchedule.isPending ||
    generatePlan.isPending ||
    (Boolean(pollUuid) && isGenerating && !pollTimedOut);

  function applyServerErrors(error: unknown) {
    if (!(error instanceof BffClientError) || !error.errors) {
      setFormAlert(
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : getUserFacingApiMessage(error)
      );
      return;
    }

    if (error.errors.topics) {
      setError("topics", { type: "server", message: error.errors.topics });
    }
    if (error.errors.availability_slots) {
      setFormAlert(error.errors.availability_slots);
      return;
    }
    setFormAlert(error.detail ?? error.title);
  }

  async function onSubmit(values: GuardianStudyPlannerValues) {
    setFormAlert(null);
    try {
      await saveSettings.mutateAsync({
        inverted_classroom: values.inverted_classroom,
        spaced_review: values.spaced_review,
        review_model: values.review_model,
        items_per_session:
          values.items_per_session === "" ? null : values.items_per_session,
        tdah_adjustment: values.tdah_adjustment,
        on_medication: values.on_medication,
      });
      await saveAvailability.mutateAsync(
        values.availability.map((slot) => ({
          weekday: slot.weekday,
          starts_at: slot.starts_at,
          ends_at: slot.ends_at,
          is_recurring: true,
          exception_dates: [],
        }))
      );
      await saveSchedule.mutateAsync(
        values.school_schedule.filter((slot) => isSchoolWeekday(slot.weekday))
      );
      const plan = await generatePlan.mutateAsync({
        starts_on: values.starts_on,
        content_deadline_on: values.content_deadline_on,
        blocked_dates: values.blocked_dates,
        exams: values.exams.map((exam) => ({
          date: exam.date,
          subject_uuids: [exam.subject_uuid],
        })),
        topics: values.topics
          .filter((topic) => topic.selected)
          .map((topic) => ({
            topic_uuid: topic.topic_uuid,
            difficulty_level: "N3",
            needs_reinforcement: topic.needs_reinforcement,
          })),
      });
      setPollUuid(plan.uuid);
    } catch (error) {
      applyServerErrors(error);
    }
  }

  if (childrenQuery.isLoading && !child) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Plano de estudos</h2>
        <p>Filho não encontrado na sua conta.</p>
        <Link href="/children" className="vs-btn">
          Voltar aos filhos
        </Link>
      </div>
    );
  }

  if (!canViewProgress) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Plano de estudos</h2>
        <div className="alert alert-warning" role="status">
          Você ainda não tem permissão para ver o progresso deste aluno.
        </div>
        <Link href={`/children/${childRef}`} className="vs-btn">
          Voltar ao acompanhamento
        </Link>
      </div>
    );
  }

  const loadError =
    boardQuery.error ||
    settingsQuery.error ||
    availabilityQuery.error ||
    scheduleQuery.error;

  if (loadError && !settingsQuery.data) {
    const message =
      loadError instanceof BffClientError
        ? (loadError.detail ?? loadError.title)
        : getUserFacingApiMessage(loadError);
    const forbidden = loadError instanceof BffClientError && loadError.status === 403;

    return (
      <div className="blog-content">
        <h2 className="blog-title">Plano de estudos</h2>
        <div className="alert alert-warning" role="status">
          {forbidden
            ? "Você ainda não tem permissão para ver o progresso deste aluno."
            : message}
        </div>
        <Link href={`/children/${childRef}`} className="vs-btn">
          Voltar ao acompanhamento
        </Link>
      </div>
    );
  }

  if (
    (settingsQuery.isLoading ||
      availabilityQuery.isLoading ||
      scheduleQuery.isLoading) &&
    !settingsQuery.data
  ) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando o plano de estudos...</p>
      </div>
    );
  }

  const title = boardQuery.data?.name ?? `Estudos de ${child.name}`;

  return (
    <div className="blog-content">
      <div className="portal-page-header">
        <h2 className="blog-title">{title}</h2>
      </div>
      <p className="mb-4">
        Defina a rotina e gere o roteiro. O aluno estuda pelos cards; você só
        configura e acompanha.
      </p>

      {displayedPlan ? <StudyPlanResult plan={displayedPlan} /> : null}

      {displayedPlan?.status === "applied" ||
      displayedPlan?.status === "generating" ? (
        <StudyKanbanBoard readOnly childRef={childRef} enabled={canViewProgress} />
      ) : null}

      {isGenerating ? (
        <div className="alert alert-info" role="status">
          <strong>Geração em andamento</strong>
          <p className="mb-0">
            Estamos montando o roteiro. Isso leva alguns segundos.
            {pollTimedOut
              ? " Ainda não terminou — você pode esperar ou gerar de novo mais tarde."
              : ""}
          </p>
        </div>
      ) : null}

      {formAlert ? (
        <div className="alert alert-danger" role="alert">
          {formAlert}
        </div>
      ) : null}

      <form className="form-style3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="widget mb-4">
          <h3 className="widget_title">Como {child.name} estuda</h3>
          <div className="form-group">
            <label className="d-flex align-items-center gap-2 mb-0">
              <input type="checkbox" {...register("inverted_classroom")} />
              Sala invertida
            </label>
          </div>
          <div className="form-group">
            <label className="d-flex align-items-center gap-2 mb-0">
              <input type="checkbox" {...register("spaced_review")} />
              Revisões espaçadas
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="review-model">Modelo de revisão</label>
            <select id="review-model" {...register("review_model")}>
              {Object.entries(REVIEW_MODEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="items-per-session">Itens por sessão (opcional)</label>
            <select id="items-per-session" {...register("items_per_session")}>
              <option value="">Automático</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div className="form-group">
            <label className="d-flex align-items-center gap-2 mb-0">
              <input
                type="checkbox"
                autoComplete="off"
                {...register("tdah_adjustment")}
              />
              Ajustar o ritmo para TDAH
            </label>
            <span className="text-muted d-block mt-1">
              Dado de saúde. Só você vê esta resposta — ela não aparece no
              quadro do aluno.
            </span>
          </div>
          <div className="form-group mb-0">
            <label className="d-flex align-items-center gap-2 mb-0">
              <input
                type="checkbox"
                autoComplete="off"
                {...register("on_medication")}
              />
              Em uso de medicação
            </label>
            <span className="text-muted d-block mt-1">
              Dado de saúde. Só você vê esta resposta.
            </span>
          </div>
        </div>

        <div className="widget mb-4">
          <h3 className="widget_title">Horários livres para estudar</h3>
          <p>
            Não é obrigatório preencher. Sem horários, o sistema avisa e
            distribui o que puder.
          </p>
          {availabilityFields.fields.map((field, index) => (
            <div key={field.id} className="row align-items-end">
              <div className="col-12 col-md-4 form-group">
                <label htmlFor={`availability-${index}-weekday`}>Dia</label>
                <select
                  id={`availability-${index}-weekday`}
                  {...register(`availability.${index}.weekday`)}
                >
                  {WEEKDAYS.map((day) => (
                    <option key={day.iso} value={day.iso}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-3 form-group">
                <label htmlFor={`availability-${index}-start`}>Início</label>
                <input
                  id={`availability-${index}-start`}
                  type="time"
                  {...register(`availability.${index}.starts_at`)}
                />
              </div>
              <div className="col-6 col-md-3 form-group">
                <label htmlFor={`availability-${index}-end`}>Fim</label>
                <input
                  id={`availability-${index}-end`}
                  type="time"
                  {...register(`availability.${index}.ends_at`)}
                />
                {fieldMessage(errors.availability?.[index]?.ends_at) ? (
                  <span className="text-danger">
                    {errors.availability?.[index]?.ends_at?.message}
                  </span>
                ) : null}
              </div>
              <div className="col-12 col-md-2 form-group">
                <button
                  type="button"
                  className="vs-btn style3"
                  onClick={() => availabilityFields.remove(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="vs-btn style3"
            onClick={() =>
              availabilityFields.append({
                weekday: "mon",
                starts_at: "14:00",
                ends_at: "16:00",
                is_recurring: true,
              })
            }
          >
            Adicionar horário
          </button>
        </div>

        <div className="widget mb-4">
          <h3 className="widget_title">Horário da escola</h3>
          <p>
            Digite o nome e escolha a disciplina. Ela fica neste dia e você
            pode incluir outra.
          </p>
          {subjectsQuery.isLoading ? (
            <p role="status">Carregando disciplinas...</p>
          ) : null}
          {subjectsQuery.isError ? (
            <p className="text-danger" role="alert">
              {getUserFacingApiMessage(subjectsQuery.error)}
            </p>
          ) : null}
          {!subjectsQuery.isLoading &&
          !subjectsQuery.isError &&
          subjects.length === 0 ? (
            <p className="mb-0">Nenhuma disciplina cadastrada.</p>
          ) : null}
          {!subjectsQuery.isLoading && subjects.length > 0 ? (
            <SchoolScheduleWeek
              subjects={subjects}
              slots={scheduleFields.fields.map((field, index) => ({
                id: field.id,
                index,
                weekday: field.weekday,
                subject_uuid: field.subject_uuid,
              }))}
              subjectName={(subjectUuid) =>
                subjectNames.get(subjectUuid) ?? "Disciplina"
              }
              onAdd={(weekday, subjectUuid) =>
                scheduleFields.append({ weekday, subject_uuid: subjectUuid })
              }
              onRemove={(index) => scheduleFields.remove(index)}
            />
          ) : null}
        </div>

        <div className="widget mb-4">
          <h3 className="widget_title">Prazo e restrições</h3>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="starts-on">Começa em</label>
              <input id="starts-on" type="date" {...register("starts_on")} />
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="deadline-on">Conteúdo até</label>
              <input
                id="deadline-on"
                type="date"
                {...register("content_deadline_on")}
              />
              {fieldMessage(errors.content_deadline_on) ? (
                <span className="text-danger">
                  {errors.content_deadline_on?.message}
                </span>
              ) : null}
            </div>
          </div>
          <p className="mb-2">Datas em que não deve estudar</p>
          {blockedDates.map((date, index) => (
            <div key={`${date}-${index}`} className="d-flex gap-2 mb-2">
              <input
                type="date"
                value={date}
                onChange={(event) => {
                  const next = [...blockedDates];
                  next[index] = event.target.value;
                  setValue("blocked_dates", next, { shouldDirty: true });
                }}
              />
              <button
                type="button"
                className="vs-btn style3"
                onClick={() =>
                  setValue(
                    "blocked_dates",
                    blockedDates.filter((_, itemIndex) => itemIndex !== index),
                    { shouldDirty: true }
                  )
                }
              >
                Remover
              </button>
            </div>
          ))}
          <p>
            <button
              type="button"
              className="vs-btn style3"
              onClick={() =>
                setValue("blocked_dates", [...blockedDates, fortalezaTodayYmd()], {
                  shouldDirty: true,
                })
              }
            >
              Bloquear uma data
            </button>
          </p>
          <p className="mb-2">Provas</p>
          {examFields.fields.map((field, index) => (
            <div key={field.id} className="row align-items-end">
              <div className="col-md-5 form-group">
                <label htmlFor={`exam-${index}-date`}>Data</label>
                <input
                  id={`exam-${index}-date`}
                  type="date"
                  {...register(`exams.${index}.date`)}
                />
              </div>
              <div className="col-md-5 form-group">
                <label htmlFor={`exam-${index}-subject`}>Disciplina</label>
                <select
                  id={`exam-${index}-subject`}
                  {...register(`exams.${index}.subject_uuid`)}
                >
                  <option value="">Escolha</option>
                  {subjects.map((subject) => (
                    <option key={subject.uuid} value={subject.uuid}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 form-group">
                <button
                  type="button"
                  className="vs-btn style3"
                  onClick={() => examFields.remove(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="vs-btn style3"
            onClick={() =>
              examFields.append({
                date: fortalezaTodayYmd(),
                subject_uuid: "",
              })
            }
            disabled={subjects.length === 0}
          >
            Adicionar prova
          </button>
        </div>

        <div className="widget mb-4">
          <h3 className="widget_title">O que entra no roteiro</h3>
          {topics.length === 0 ? (
            <div className="alert alert-info" role="status">
              Ainda não há conteúdos liberados para montar o roteiro.
            </div>
          ) : (
            topics.map((topic, index) => (
              <div key={topic.topic_uuid} className="border-bottom py-3">
                <label className="d-flex align-items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    {...register(`topics.${index}.selected`)}
                  />
                  <strong>{topic.name}</strong>
                </label>
                {topic.selected ? (
                  <label className="d-flex align-items-center gap-2 mb-0">
                    <input
                      type="checkbox"
                      {...register(`topics.${index}.needs_reinforcement`)}
                    />
                    Precisa de reforço
                  </label>
                ) : null}
              </div>
            ))
          )}
          {fieldMessage(errors.topics) ? (
            <span className="text-danger d-block mt-2">
              {typeof errors.topics?.message === "string"
                ? errors.topics.message
                : "Escolha pelo menos um tópico para o roteiro."}
            </span>
          ) : null}
        </div>

        <div className="form-group mb-4">
          <button className="vs-btn" type="submit" disabled={isSaving}>
            {isSaving
              ? "Gerando plano..."
              : displayedPlan?.status === "applied"
                ? "Gerar novo roteiro"
                : "Gerar plano"}
          </button>
        </div>
      </form>

      <div className="widget mb-4">
        <h3 className="widget_title">Roteiros anteriores</h3>
        <StudyPlanHistory childRef={childRef} enabled={canViewProgress} />
      </div>

      <p>
        <Link href={`/children/${childRef}`} className="vs-btn style3">
          Voltar ao acompanhamento
        </Link>
      </p>
    </div>
  );
}
