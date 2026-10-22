import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { LearningQueryFilters } from "../../types/domain/learning.ts";
import { learningSearchParams } from "./learning-search-params.ts";

const SUBJECT = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

const filters: LearningQueryFilters = {
  date_from: "2026-10-01",
  date_to: "2026-10-22",
  outcome: "correct",
  session_position: "start",
};

describe("learningSearchParams", () => {
  it("keeps period, outcome and moment without subject_uuid", () => {
    const params = new URLSearchParams(learningSearchParams(filters));

    assert.equal(params.get("date_from"), "2026-10-01");
    assert.equal(params.get("date_to"), "2026-10-22");
    assert.equal(params.get("outcome"), "correct");
    assert.equal(params.get("session_position"), "start");
    assert.equal(params.has("subject_uuid"), false);
  });

  it("omits a blank subject_uuid", () => {
    const params = new URLSearchParams(
      learningSearchParams({ ...filters, subject_uuid: "   " })
    );

    assert.equal(params.has("subject_uuid"), false);
  });

  it("adds subject_uuid next to period, outcome and moment", () => {
    const params = new URLSearchParams(
      learningSearchParams({ ...filters, subject_uuid: ` ${SUBJECT} ` }, "accuracy_over_time")
    );

    assert.equal(params.get("date_from"), "2026-10-01");
    assert.equal(params.get("date_to"), "2026-10-22");
    assert.equal(params.get("outcome"), "correct");
    assert.equal(params.get("session_position"), "start");
    assert.equal(params.get("series"), "accuracy_over_time");
    assert.equal(params.get("subject_uuid"), SUBJECT);
  });
});
