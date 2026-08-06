"use client";

import type { ContentQuestion } from "@/types/student-learning";
import {
  optionLetter,
  type LessonTabMeta,
} from "@/features/content-player/lib/lesson-utils";

type LessonQuestionsTabProps = {
  tab: LessonTabMeta;
  questions: ContentQuestion[];
  answers: Record<number, number>;
  onAnswer: (questionIndex: number, optionIndex: number) => void;
  readOnly?: boolean;
};

export function LessonQuestionsTab({
  tab,
  questions,
  answers,
  onAnswer,
  readOnly = false,
}: LessonQuestionsTabProps) {
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([questionIndex, optionIndex]) => {
      const question = questions[Number(questionIndex)];
      return question?.options[optionIndex]?.is_correct === true;
    }
  ).length;
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

      {questions.map((question, questionIndex) => {
        const selectedOption = answers[questionIndex];
        const isAnswered = selectedOption !== undefined;
        const correctOptionIndex = question.options.findIndex(
          (option) => option.is_correct
        );

        return (
          <div
            key={`${tab.id}-${questionIndex}`}
            className="lesson-player__question"
          >
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
                const isSelected = selectedOption === optionIndex;
                const isCorrect = option.is_correct;
                let stateClass = "";

                if (isAnswered) {
                  if (isCorrect) stateClass = " is-correct";
                  else if (isSelected) stateClass = " is-wrong";
                }

                return (
                  <button
                    key={`${tab.id}-${questionIndex}-${optionIndex}`}
                    type="button"
                    className={`lesson-player__option${stateClass}`}
                    disabled={readOnly || isAnswered}
                    onClick={() => onAnswer(questionIndex, optionIndex)}
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
      })}
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
