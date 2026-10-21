import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveStudentMaterialsSearch } from "./student-materials-search.ts";

const SUBJECT = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

describe("resolveStudentMaterialsSearch", () => {
  it("omits search when the term is missing, empty, or a single character", () => {
    for (const search of [undefined, "", " ", "f", " f "]) {
      assert.deepEqual(resolveStudentMaterialsSearch(search), {
        term: "",
        subjectUuid: "",
        path: "/api/student/materials",
      });
    }
  });

  it("builds search when the trimmed term has two or more characters", () => {
    assert.deepEqual(resolveStudentMaterialsSearch("fr"), {
      term: "fr",
      subjectUuid: "",
      path: "/api/student/materials?search=fr",
    });
    assert.deepEqual(resolveStudentMaterialsSearch("  fr  "), {
      term: "fr",
      subjectUuid: "",
      path: "/api/student/materials?search=fr",
    });
  });

  it("encodes spaces and accents in the query", () => {
    assert.deepEqual(resolveStudentMaterialsSearch("fração equivalente"), {
      term: "fração equivalente",
      subjectUuid: "",
      path: "/api/student/materials?search=fra%C3%A7%C3%A3o%20equivalente",
    });
  });

  it("omits search and keeps subject_uuid when the term is too short", () => {
    assert.deepEqual(resolveStudentMaterialsSearch("f", `  ${SUBJECT}  `), {
      term: "",
      subjectUuid: SUBJECT,
      path: `/api/student/materials?subject_uuid=${SUBJECT}`,
    });
    assert.deepEqual(resolveStudentMaterialsSearch(undefined, SUBJECT), {
      term: "",
      subjectUuid: SUBJECT,
      path: `/api/student/materials?subject_uuid=${SUBJECT}`,
    });
  });

  it("sends search and subject_uuid when the term has two characters", () => {
    assert.deepEqual(resolveStudentMaterialsSearch("fr", SUBJECT), {
      term: "fr",
      subjectUuid: SUBJECT,
      path: `/api/student/materials?search=fr&subject_uuid=${SUBJECT}`,
    });
  });

  it("omits a blank subject and keeps the search path", () => {
    assert.deepEqual(resolveStudentMaterialsSearch("  fr  ", "   "), {
      term: "fr",
      subjectUuid: "",
      path: "/api/student/materials?search=fr",
    });
  });
});
