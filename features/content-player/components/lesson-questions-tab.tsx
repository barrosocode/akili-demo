"use client";

import { useRef } from "react";

import type { ContentQuestion } from "@/types/student-learning";
import {
  isPersistedQuestionUuid,
  optionLetter,
  questionAnswerKey,
  type LessonTabMeta,
} from "@/features/content-player/lib/lesson-utils";

type LessonQuestionsTabProps = {
  tab: LessonTabMeta;
  questions: ContentQuestion[];
  answers: Record<string, string>;
  pendingQuestionKey?: string | null;
  questionErrors?: Record<string, string>;
  onAnswer: (
    questionKey: string,
    optionKey: string,
    responseTimeMs: number
  ) => void;
  readOnly?: boolean;
};

export function LessonQuestionsTab({
  tab,
  questions,
  answers,
  pendingQuestionKey = null,
  questionErrors = {},
  onAnswer,
  readOnly = false,
}: LessonQuestionsTabProps) {
  const answeredCount = Object.keys(answers).length;
  const correctCount = questions.reduce((total, question, questionIndex) => {
    const key = questionAnswerKey(question, questionIndex);
    const selected = answers[key];
    if (selected === undefined) return total;
    const option = question.options.find(
      (item, optionIndex) => optionAnswerKey(item.uuid, optionIndex) === selected
    );
    return option?.is_correct ? total + 1 : total;
  }, 0);
  const pct =
    answeredCount > 0
      ? Math.round((correctCount / answeredCount) * 100)
      : null;
  const allDone = questions.length > 0 && answeredCount === questions.length;

  if (questions.length === 0) {
    return (
      <div>
        <TierHeader tab={tab} />
        <p className="lesson-player__empty">
          Nenhuma questão disponível nesta aba.
        </p>
      </div>
    );
  }

  return (
    <div>
      <TierHeader tab={tab} />

      <div className="lesson-player__stats">
        <span>
          Respondidas:{" "}
          <b>
            {answeredCount}/{questions.length}
          </b>
        </span>
        <span>
          Acertos: <b>{correctCount}</b>
        </span>
        <span
          className={`lesson-player__stats-pct${allDone ? " is-done" : ""}`}
        >
          {pct === null ? "—" : `${pct}%`}
        </span>
      </div>

      {questions.map((question, questionIndex) => (
        <QuestionBlock
          key={question.uuid ?? questionAnswerKey(question, questionIndex)}
          question={question}
          questionIndex={questionIndex}
          selectedOptionKey={answers[questionAnswerKey(question, questionIndex)]}
          isPending={
            pendingQuestionKey === questionAnswerKey(question, questionIndex)
          }
          error={questionErrors[questionAnswerKey(question, questionIndex)]}
          onAnswer={onAnswer}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}

function optionAnswerKey(uuid: string | undefined, index: number): string {
  return isPersistedQuestionUuid(uuid) ? uuid : `legacy-opt:${index}`;
}

function QuestionBlock({
  question,
  questionIndex,
  selectedOptionKey,
  isPending,
  error,
  onAnswer,
  readOnly,
}: {
  question: ContentQuestion;
  questionIndex: number;
  selectedOptionKey: string | undefined;
  isPending: boolean;
  error?: string;
  onAnswer: (
    questionKey: string,
    optionKey: string,
    responseTimeMs: number
  ) => void;
  readOnly: boolean;
}) {
  const startedAt = useRef(
    typeof performance !== "undefined" ? performance.now() : Date.now()
  );
  const questionKey = questionAnswerKey(question, questionIndex);
  const isAnswered = selectedOptionKey !== undefined;
  const correctOptionIndex = question.options.findIndex(
    (option) => option.is_correct
  );

  return (
    <div className="lesson-player__question">
      <div className="lesson-player__question-text">
        <span className="lesson-player__question-num">
          {questionIndex + 1}.
        </span>
        <span dangerouslySetInnerHTML={{ __html: question.text }} />
      </div>

      {question.image ? (
        <figure className="lesson-player__figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={question.image}
            alt=""
            style={{ maxHeight: 192, objectFit: "contain" }}
          />
        </figure>
      ) : null}

      {question.hint && !isAnswered ? (
        <p className="lesson-player__hint">Dica: {question.hint}</p>
      ) : null}

      <div className="lesson-player__options">
        {question.options.map((option, optionIndex) => {
          const optionKey = optionAnswerKey(option.uuid, optionIndex);
          const isSelected = selectedOptionKey === optionKey;
          let stateClass = "";

          if (isAnswered) {
            if (option.is_correct) stateClass = " is-correct";
            else if (isSelected) stateClass = " is-wrong";
          }

          return (
            <button
              key={option.uuid ?? optionKey}
              type="button"
              className={`lesson-player__option${stateClass}`}
              disabled={readOnly || isAnswered || isPending}
              onClick={() => {
                const elapsed = Math.max(
                  0,
                  Math.round(
                    (typeof performance !== "undefined"
                      ? performance.now()
                      : Date.now()) - startedAt.current
                  )
                );
                onAnswer(questionKey, optionKey, elapsed);
              }}
            >
              <span className="lesson-player__option-mark">
                {optionLetter(optionIndex)}
              </span>
              <span
                style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}
                dangerouslySetInnerHTML={{ __html: option.text }}
              />
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-danger mt-2 mb-0" role="alert">
          {error}
        </p>
      ) : null}

      {isAnswered && question.explanation ? (
        <div className="lesson-player__explanation">
          <strong>
            Por que (resposta {optionLetter(correctOptionIndex)}):
          </strong>{" "}
          {question.explanation}
        </div>
      ) : null}
    </div>
  );
}

function TierHeader({ tab }: { tab: LessonTabMeta }) {
  if (!tab.tierName) return null;

  return (
    <div className="lesson-player__tier">
      <span className="lesson-player__tier-name">{tab.tierName}</span>
      {tab.tierSub ? (
        <span className="lesson-player__tier-sub">{tab.tierSub}</span>
      ) : null}
    </div>
  );
}
