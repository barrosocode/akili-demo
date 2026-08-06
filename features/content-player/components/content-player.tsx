"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  useGuardianSupervisionContentQuery,
  useSaveStudentProgressMutation,
  useStudentContentQuery,
} from "@/features/student/hooks/use-student-materials";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import type { ContentPage, ContentQuestion } from "@/types/student-learning";

type ContentPlayerProps = {
  contentUuid: string;
  readOnly?: boolean;
  childRef?: string;
  backHref?: string;
};

function PageView({ page }: { page: ContentPage }) {
  return (
    <article className="widget mb-4">
      {page.top_image ? (
        <img
          src={page.top_image}
          alt=""
          className="mb-3 rounded"
          style={{ maxHeight: 240, width: "100%", objectFit: "cover" }}
        />
      ) : null}
      <h3 className="widget_title">{page.title}</h3>
      {page.text ? (
        <div
          className="mb-3"
          dangerouslySetInnerHTML={{ __html: page.text }}
        />
      ) : null}
      {page.items.map((item) => {
        if (item.type === "topic") {
          return (
            <section key={`${item.order}-${item.title}`} className="mb-4">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="mb-2 rounded"
                  style={{ maxWidth: "100%" }}
                />
              ) : null}
              <h4>{item.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: item.text }} />
            </section>
          );
        }

        return (
          <p key={`${item.order}-${item.item}`} className="mb-2">
            <button type="button" className="vs-btn style3" disabled>
              {item.action_text ?? "Ouvir"}
            </button>
          </p>
        );
      })}
    </article>
  );
}

function QuestionView({
  question,
  index,
  readOnly,
  onAnswer,
}: {
  question: ContentQuestion;
  index: number;
  readOnly: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSelect(optionIndex: number, isCorrect: boolean) {
    if (readOnly || selected !== null) return;
    setSelected(optionIndex);
    setFeedback(isCorrect ? "Muito bem!" : question.explanation ?? "Tente novamente na próxima vez.");
    onAnswer(isCorrect);
  }

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Questão {index + 1}</h3>
      <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.text }} />
      <div className="d-flex flex-column gap-2">
        {question.options.map((option, optionIndex) => (
          <button
            key={`${index}-${optionIndex}`}
            type="button"
            className={selected === optionIndex ? "vs-btn" : "vs-btn style3"}
            disabled={readOnly || selected !== null}
            onClick={() => handleSelect(optionIndex, option.is_correct)}
          >
            <span dangerouslySetInnerHTML={{ __html: option.text }} />
          </button>
        ))}
      </div>
      {feedback ? <p className="mt-3 mb-0">{feedback}</p> : null}
      {question.hint && selected === null ? (
        <p className="small text-muted mt-2">Dica: {question.hint}</p>
      ) : null}
    </div>
  );
}

export function ContentPlayer({
  contentUuid,
  readOnly = false,
  childRef,
  backHref = "/aluno/materiais",
}: ContentPlayerProps) {
  const studentQuery = useStudentContentQuery(contentUuid, !readOnly);
  const supervisionQuery = useGuardianSupervisionContentQuery(
    childRef ?? "",
    contentUuid,
    readOnly && Boolean(childRef)
  );
  const saveProgress = useSaveStudentProgressMutation(contentUuid);

  const query = readOnly ? supervisionQuery : studentQuery;
  const playback = query.data;
  const pages = playback?.version.pages ?? [];
  const questions = playback?.version.questions ?? [];
  const totalSteps = pages.length + questions.length;

  const initialPage = playback?.material?.progress.last_page_index ?? 0;
  const [stepIndex, setStepIndex] = useState(initialPage);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    setStepIndex(initialPage);
  }, [initialPage, contentUuid]);

  const percent = useMemo(() => {
    if (!totalSteps) return 0;
    return Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));
  }, [stepIndex, totalSteps]);

  async function persistProgress(nextIndex: number, markCompleted = false) {
    if (readOnly || !playback) return;
    const nextPercent = totalSteps
      ? Math.min(100, Math.round(((nextIndex + 1) / totalSteps) * 100))
      : 0;

    await saveProgress.mutateAsync({
      content_version_uuid: playback.version.uuid,
      last_page_index: nextIndex,
      percent_complete: markCompleted ? 100 : nextPercent,
      time_studied_seconds_delta: 30,
      mark_completed: markCompleted,
    });
  }

  async function handleNext() {
    const next = Math.min(stepIndex + 1, Math.max(totalSteps - 1, 0));
    setStepIndex(next);
    await persistProgress(next, next >= totalSteps - 1 && totalSteps > 0);
  }

  async function handlePrevious() {
    setStepIndex((current) => Math.max(0, current - 1));
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
        <p style={{ color: "red" }}>
          {query.error instanceof BffClientError
            ? (query.error.detail ?? query.error.title)
            : getUserFacingApiMessage(query.error)}
        </p>
        <Link href={backHref} className="vs-btn">
          Voltar
        </Link>
      </div>
    );
  }

  const isPageStep = stepIndex < pages.length;
  const currentPage = isPageStep ? pages[stepIndex] : null;
  const currentQuestion = !isPageStep ? questions[stepIndex - pages.length] : null;

  return (
    <div className="blog-content">
      {readOnly ? (
        <div className="alert alert-info mb-4" role="status">
          Visualização somente leitura — atividades desabilitadas.
        </div>
      ) : null}

      <div className="portal-page-header">
        <h2 className="blog-title">{playback.content.name}</h2>
        {playback.content.subject ? (
          <span className="portal-chip portal-chip--muted">
            {playback.content.subject.name}
          </span>
        ) : null}
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between small mb-1">
          <span>Progresso da lição</span>
          <strong>{percent}%</strong>
        </div>
        <div className="progress" aria-label="Progresso da lição">
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {currentPage ? <PageView page={currentPage} /> : null}

      {currentQuestion ? (
        <QuestionView
          question={currentQuestion}
          index={stepIndex - pages.length}
          readOnly={readOnly}
          onAnswer={(correct) => {
            if (correct) setCorrectAnswers((value) => value + 1);
          }}
        />
      ) : null}

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          className="vs-btn style3"
          onClick={handlePrevious}
          disabled={stepIndex === 0}
        >
          Anterior
        </button>
        {!readOnly ? (
          <button
            type="button"
            className="vs-btn"
            onClick={handleNext}
            disabled={saveProgress.isPending || stepIndex >= totalSteps - 1}
          >
            {stepIndex >= totalSteps - 1 ? "Concluído" : "Próximo"}
          </button>
        ) : (
          <button
            type="button"
            className="vs-btn"
            onClick={handleNext}
            disabled={stepIndex >= totalSteps - 1}
          >
            Próximo
          </button>
        )}
        <Link href={backHref} className="vs-btn style3">
          Voltar aos materiais
        </Link>
      </div>

      {!readOnly && correctAnswers > 0 ? (
        <p className="small mt-3 mb-0">
          Respostas corretas nesta sessão: {correctAnswers}
        </p>
      ) : null}
    </div>
  );
}
