import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AuthUser } from "../../types/auth.ts";
import { resolvePortalDestination } from "./portal-destination.ts";

function user(overrides: Partial<AuthUser>): AuthUser {
  return {
    uuid: "user-1",
    name: "Pessoa",
    email: "pessoa@escola-exemplo.dev",
    profile_photo_url: null,
    type: "guardian",
    status: "active",
    roles: [],
    permissions: [],
    last_login_at: null,
    ...overrides,
  };
}

describe("resolvePortalDestination", () => {
  it("sends students to /aluno", () => {
    const destination = resolvePortalDestination(
      user({ type: "student", roles: ["student"] })
    );
    assert.equal(destination.portal, "student");
    assert.equal(destination.redirectTo, "/aluno");
  });

  it("keeps school-linked guardians on the family portal", () => {
    const destination = resolvePortalDestination(
      user({
        type: "guardian",
        roles: ["guardian", "school_admin"],
        permissions: ["dashboards.guardian.view"],
      })
    );
    assert.equal(destination.portal, "guardian");
    assert.equal(destination.redirectTo, "/");
  });

  it("keeps users with the guardian role on the family portal", () => {
    const destination = resolvePortalDestination(
      user({
        type: "school_admin",
        roles: ["guardian"],
        permissions: [],
      })
    );
    assert.equal(destination.portal, "guardian");
  });

  it("sends pure school staff to the admin app", () => {
    const destination = resolvePortalDestination(
      user({
        type: "school_admin",
        roles: ["school_admin"],
        permissions: ["dashboards.school.view"],
      })
    );
    assert.equal(destination.portal, "admin");
  });

  it("sends teachers to the admin app", () => {
    const destination = resolvePortalDestination(
      user({
        type: "teacher",
        roles: ["teacher"],
        email: "professor@escola-exemplo.dev",
      })
    );
    assert.equal(destination.portal, "admin");
  });
});
