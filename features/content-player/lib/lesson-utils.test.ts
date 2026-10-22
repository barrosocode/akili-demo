import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { ContentQuestion } from "../../../types/student-learning.ts";
import {
  omitEmptyQuestionTabs,
  resolveTabsFromIds,
  type QuestionTabDistribution,
} from "./lesson-utils.ts";

function question(text: string): ContentQuestion {
  return { text, options: [{ text: "A", is_correct: true }] };
}

function distribution(
  overrides: Partial<QuestionTabDistribution> = {}
): QuestionTabDistribution {
  return {
    conf: [],
    r1: [],
    r2: [],
    r3: [],
    desafio: [],
    ...overrides,
  };
}

describe("resolveTabsFromIds", () => {
  it("keeps the six known tabs in session order, with Desafio last", () => {
    const tabs = resolveTabsFromIds([
      "treino",
      "conf",
      "r1",
      "r2",
      "r3",
      "desafio",
    ]);

    assert.deepEqual(
      tabs.map((tab) => tab.id),
      ["treino", "conf", "r1", "r2", "r3", "desafio"]
    );
    assert.equal(tabs.at(-1)?.label, "Desafio");
  });

  it("drops an unknown id and a repeated desafio", () => {
    const tabs = resolveTabsFromIds([
      "treino",
      "desconhecido",
      "desafio",
      "desafio",
      "conf",
    ]);

    assert.deepEqual(
      tabs.map((tab) => tab.id),
      ["treino", "desafio", "conf"]
    );
  });
});

describe("omitEmptyQuestionTabs", () => {
  const tabs = resolveTabsFromIds([
    "treino",
    "conf",
    "r1",
    "r2",
    "r3",
    "desafio",
  ]);

  it("keeps treino and drops question tabs with an empty bucket", () => {
    const visible = omitEmptyQuestionTabs(
      tabs,
      distribution({ conf: [question("conferência")] })
    );

    assert.deepEqual(
      visible.map((tab) => tab.id),
      ["treino", "conf"]
    );
  });

  it("keeps desafio only when the bucket has a question", () => {
    const visible = omitEmptyQuestionTabs(
      tabs,
      distribution({
        conf: [question("conferência")],
        r1: [question("revisão")],
        desafio: [question("generalização")],
      })
    );

    assert.deepEqual(
      visible.map((tab) => tab.id),
      ["treino", "conf", "r1", "desafio"]
    );
  });
});
