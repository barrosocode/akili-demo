import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveStudentSubjects } from "./resolve-student-subjects.ts";

function material(uuid: string | null, name = "Nome") {
  return {
    content: {
      subject: uuid ? { uuid, name } : null,
    },
  };
}

function catalogItem(
  uuid: string,
  name: string,
  color = "#2563eb",
  icon = "book-open",
) {
  return { uuid, name, color, icon };
}

describe("resolveStudentSubjects", () => {
  it("lists the student's subjects in pt-BR order with catalog color and icon", () => {
    const result = resolveStudentSubjects(
      [
        material("mat", "Matemática"),
        material("his", "História"),
        material("cie", "Ciências"),
      ],
      [
        catalogItem("his", "História", "#b45309", "landmark"),
        catalogItem("mat", "Matemática", "#2563eb", "layout-grid"),
        catalogItem("cie", "Ciências", "#7c3aed", "flask-conical"),
        catalogItem("por", "Português", "#16a34a", "book-open"),
      ],
    );

    assert.deepEqual(
      result.map((subject) => subject.name),
      ["Ciências", "História", "Matemática"],
    );
    assert.equal(result[0]?.color, "#7c3aed");
    assert.equal(result[0]?.icon, "flask-conical");
  });

  it("collapses two lessons of the same subject into one row", () => {
    const result = resolveStudentSubjects(
      [material("mat", "Matemática"), material("mat", "Matemática")],
      [catalogItem("mat", "Matemática")],
    );

    assert.equal(result.length, 1);
    assert.equal(result[0]?.name, "Matemática");
  });

  it("drops a catalog subject the student does not have", () => {
    const result = resolveStudentSubjects(
      [material("mat", "Matemática")],
      [catalogItem("mat", "Matemática"), catalogItem("por", "Português")],
    );

    assert.deepEqual(
      result.map((subject) => subject.uuid),
      ["mat"],
    );
  });

  it("drops a material subject missing from the catalog", () => {
    const result = resolveStudentSubjects(
      [material("ghost", "Fantasma"), material("mat", "Matemática")],
      [catalogItem("mat", "Matemática")],
    );

    assert.deepEqual(
      result.map((subject) => subject.name),
      ["Matemática"],
    );
  });

  it("ignores materials without a subject", () => {
    const result = resolveStudentSubjects(
      [material(null), material("mat", "Matemática")],
      [catalogItem("mat", "Matemática")],
    );

    assert.equal(result.length, 1);
  });

  it("keeps the first catalog occurrence of a repeated uuid", () => {
    const result = resolveStudentSubjects(
      [material("mat")],
      [
        catalogItem("mat", "Matemática", "#2563eb", "layout-grid"),
        catalogItem("mat", "Outra", "#111111", "book"),
      ],
    );

    assert.equal(result.length, 1);
    assert.equal(result[0]?.name, "Matemática");
    assert.equal(result[0]?.color, "#2563eb");
    assert.equal(result[0]?.icon, "layout-grid");
  });
});
