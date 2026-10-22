import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { selectSubjectProgress } from "./select-subject-progress.ts";
import type { SubjectProgressItem } from "../../../types/student-learning.ts";

function item(
  uuid: string,
  name: string,
  percent: number,
): SubjectProgressItem {
  return {
    subject: { uuid, name, color: "#16a34a", icon: "book-open" },
    materials_total: 25,
    materials_completed: 17,
    percent,
  };
}

describe("selectSubjectProgress", () => {
  it("returns an empty list when the field is missing or not an array", () => {
    assert.deepEqual(selectSubjectProgress(undefined, "preview"), []);
    assert.deepEqual(selectSubjectProgress(null, "full"), []);
    assert.deepEqual(
      selectSubjectProgress("portugues" as unknown as SubjectProgressItem[], "full"),
      [],
    );
  });

  it("drops items without a non-empty subject uuid", () => {
    const broken = {
      subject: { uuid: "   ", name: "Vazio", color: "#16a34a", icon: "book-open" },
      materials_total: 1,
      materials_completed: 0,
      percent: 0,
    } as SubjectProgressItem;

    const result = selectSubjectProgress(
      [broken, item("por", "Português", 80), { subject: null } as unknown as SubjectProgressItem],
      "full",
    );

    assert.deepEqual(
      result.map((entry) => entry.subject.name),
      ["Português"],
    );
  });

  it("keeps the first occurrence of a repeated uuid and preserves order", () => {
    const result = selectSubjectProgress(
      [
        item("mat", "Matemática", 10),
        item("por", "Português", 80),
        item("mat", "Matemática duplicada", 90),
        item("his", "História", 40),
      ],
      "full",
    );

    assert.deepEqual(
      result.map((entry) => entry.subject.name),
      ["Matemática", "Português", "História"],
    );
    assert.equal(result[0]?.percent, 10);
  });

  it("cuts the preview at three items without sorting", () => {
    const source = [
      item("cie", "Ciências", 5),
      item("his", "História", 90),
      item("geo", "Geografia", 40),
      item("por", "Português", 80),
    ];

    const preview = selectSubjectProgress(source, "preview");
    const full = selectSubjectProgress(source, "full");

    assert.deepEqual(
      preview.map((entry) => entry.subject.name),
      ["Ciências", "História", "Geografia"],
    );
    assert.deepEqual(
      full.map((entry) => entry.subject.name),
      ["Ciências", "História", "Geografia", "Português"],
    );
  });
});
