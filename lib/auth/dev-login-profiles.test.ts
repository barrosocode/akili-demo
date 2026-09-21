import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEV_LOGIN_GUARDIAN,
  DEV_LOGIN_PROFILES,
  DEV_LOGIN_STUDENT,
  DEV_LOGIN_STUDENT_PROFILES,
  isDevLoginPanelEnabled,
} from "./dev-login-profiles.ts";

const STAFF_ROLE_IDS = [
  "master",
  "school_admin",
  "teacher",
  "coordinator",
  "coordenacao",
  "professor",
  "admin",
];

describe("DEV_LOGIN_PROFILES", () => {
  it("exposes only guardian and student seed accounts", () => {
    assert.deepEqual(
      DEV_LOGIN_PROFILES.map((profile) => profile.id),
      ["guardian", "student"]
    );
    assert.equal(DEV_LOGIN_PROFILES.length, 2);
  });

  it("uses human Portuguese labels, never role slugs in the UI", () => {
    assert.equal(DEV_LOGIN_GUARDIAN.label, "Responsável");
    assert.equal(DEV_LOGIN_STUDENT.label, "Aluno");
    for (const profile of DEV_LOGIN_PROFILES) {
      assert.notEqual(profile.label, profile.id);
      assert.equal(STAFF_ROLE_IDS.includes(profile.label.toLowerCase()), false);
    }
  });

  it("uses only documented *.dev seed emails", () => {
    for (const profile of DEV_LOGIN_PROFILES) {
      assert.match(profile.email, /@[\w.-]+\.dev$/);
      assert.doesNotMatch(profile.email, /gmail\.com/i);
      assert.doesNotMatch(profile.email, /demo\.akili\.dev/i);
    }
    assert.equal(DEV_LOGIN_GUARDIAN.email, "responsavel@escola-exemplo.dev");
    assert.equal(DEV_LOGIN_STUDENT.email, "aluno@escola-exemplo.dev");
  });

  it("uses documented seed passwords", () => {
    assert.equal(DEV_LOGIN_GUARDIAN.password, "password");
    assert.equal(DEV_LOGIN_STUDENT.password, "123123");
  });

  it("does not include staff or personal accounts", () => {
    const ids = DEV_LOGIN_PROFILES.map((profile) => profile.id);
    for (const staffId of STAFF_ROLE_IDS) {
      assert.equal(ids.includes(staffId), false);
    }
  });
});

describe("DEV_LOGIN_STUDENT_PROFILES", () => {
  it("contains only the student seed for /aluno/entrar", () => {
    assert.deepEqual(DEV_LOGIN_STUDENT_PROFILES, [DEV_LOGIN_STUDENT]);
    assert.equal(DEV_LOGIN_STUDENT_PROFILES.length, 1);
    assert.equal(DEV_LOGIN_STUDENT_PROFILES[0]?.label, "Aluno");
  });
});

describe("isDevLoginPanelEnabled", () => {
  it("is true in development even without the env flag", () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousDev = process.env.DEV_LOGIN_PANEL;
    const previousPublic = process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL;
    try {
      delete process.env.DEV_LOGIN_PANEL;
      delete process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL;
      process.env.NODE_ENV = "development";
      assert.equal(isDevLoginPanelEnabled(), true);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      restoreEnv("DEV_LOGIN_PANEL", previousDev);
      restoreEnv("NEXT_PUBLIC_DEV_LOGIN_PANEL", previousPublic);
    }
  });

  it("follows DEV_LOGIN_PANEL / NEXT_PUBLIC_DEV_LOGIN_PANEL in production", () => {
    const previousNodeEnv = process.env.NODE_ENV;
    const previousDev = process.env.DEV_LOGIN_PANEL;
    const previousPublic = process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL;
    try {
      process.env.NODE_ENV = "production";
      delete process.env.DEV_LOGIN_PANEL;
      delete process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL;
      assert.equal(isDevLoginPanelEnabled(), false);

      process.env.DEV_LOGIN_PANEL = "true";
      assert.equal(isDevLoginPanelEnabled(), true);

      process.env.DEV_LOGIN_PANEL = "false";
      process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL = "1";
      assert.equal(isDevLoginPanelEnabled(), true);

      process.env.NEXT_PUBLIC_DEV_LOGIN_PANEL = "false";
      assert.equal(isDevLoginPanelEnabled(), false);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      restoreEnv("DEV_LOGIN_PANEL", previousDev);
      restoreEnv("NEXT_PUBLIC_DEV_LOGIN_PANEL", previousPublic);
    }
  });
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }
  process.env[name] = value;
}
