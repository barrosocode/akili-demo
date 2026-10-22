import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { studentProgressScopeQuery } from "./student-progress-scope.ts";

const SUBJECT = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

describe("studentProgressScopeQuery", () => {
  it("omits the query when the subject is missing or blank", () => {
    for (const subject of [undefined, null, "", " ", "   "]) {
      assert.equal(studentProgressScopeQuery(subject), "");
    }
  });

  it("sends subject_uuid when the subject is filled", () => {
    const params = new URLSearchParams(studentProgressScopeQuery(`  ${SUBJECT}  `).slice(1));

    assert.equal(params.get("subject_uuid"), SUBJECT);
    assert.equal(studentProgressScopeQuery(SUBJECT), `?subject_uuid=${SUBJECT}`);
  });
});
