import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveSubjectColor, subjectSurfaceColor } from "./subject-color.ts";

describe("resolveSubjectColor", () => {
  it("normalizes uppercase hex", () => {
    assert.equal(resolveSubjectColor("#16A34A"), "#16a34a");
    assert.equal(resolveSubjectColor("  #2563EB  "), "#2563eb");
  });

  it("falls back when the color is not #RRGGBB", () => {
    assert.equal(resolveSubjectColor("#fff"), "#64748b");
    assert.equal(resolveSubjectColor("#16a34a80"), "#64748b");
    assert.equal(resolveSubjectColor("16a34a"), "#64748b");
    assert.equal(resolveSubjectColor(""), "#64748b");
    assert.equal(resolveSubjectColor(null), "#64748b");
    assert.equal(resolveSubjectColor(undefined), "#64748b");
  });
});

describe("subjectSurfaceColor", () => {
  it("uses the resolved color with alpha 0.12", () => {
    assert.equal(subjectSurfaceColor("#16A34A"), "rgba(22, 163, 74, 0.12)");
  });

  it("uses the fallback color in the pastel", () => {
    assert.equal(subjectSurfaceColor("nope"), "rgba(100, 116, 139, 0.12)");
  });
});
