import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createTawkSessionController,
  tawkSessionKeyFromUser,
} from "./tawk-session.ts";
import type { TawkIdentity } from "./tawk.types.ts";

function identity(userId: string): TawkIdentity {
  return {
    user_id: userId,
    name: `User ${userId}`,
    email: `${userId}@example.com`,
    hash: `hash-${userId}`,
  };
}

describe("tawkSessionKeyFromUser", () => {
  it("returns null without email", () => {
    assert.equal(tawkSessionKeyFromUser(null), null);
    assert.equal(tawkSessionKeyFromUser({ email: "", isDemo: false }), null);
  });

  it("changes when demo persona changes", () => {
    const a = tawkSessionKeyFromUser({
      email: "a@example.com",
      isDemo: true,
      demoPersonaKey: "guardian_a",
    });
    const b = tawkSessionKeyFromUser({
      email: "a@example.com",
      isDemo: true,
      demoPersonaKey: "guardian_b",
    });
    assert.notEqual(a, b);
  });
});

describe("createTawkSessionController", () => {
  it("does not call Identity API when unauthenticated", async () => {
    let fetchCount = 0;
    let loginCount = 0;
    let logoutCount = 0;

    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        fetchCount += 1;
        return identity("u1");
      },
      login: async () => {
        loginCount += 1;
      },
      logout: async () => {
        logoutCount += 1;
      },
      maximize: () => undefined,
    });

    const result = await controller.syncSession(null);
    assert.equal(result, "cleared");
    assert.equal(fetchCount, 0);
    assert.equal(loginCount, 0);
    assert.equal(logoutCount, 1);
  });

  it("identifies authenticated user only with API payload", async () => {
    const logins: TawkIdentity[] = [];
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => identity("api-user"),
      login: async (payload) => {
        logins.push(payload);
      },
      logout: async () => undefined,
      maximize: () => undefined,
    });

    const result = await controller.syncSession("a@example.com::live");
    assert.equal(result, "identified");
    assert.equal(logins.length, 1);
    assert.deepEqual(logins[0], identity("api-user"));
    assert.equal(controller.getState().identifiedUserId, "api-user");
  });

  it("dedupes Identity API for the same session", async () => {
    let fetchCount = 0;
    let loginCount = 0;
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        fetchCount += 1;
        return identity("u1");
      },
      login: async () => {
        loginCount += 1;
      },
      logout: async () => undefined,
      maximize: () => undefined,
    });

    await controller.syncSession("a@example.com::live");
    const second = await controller.syncSession("a@example.com::live");
    assert.equal(second, "unchanged");
    assert.equal(fetchCount, 1);
    assert.equal(loginCount, 1);
  });

  it("logs out previous identity before switching user", async () => {
    const events: string[] = [];
    let current = "u1";

    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => identity(current),
      login: async (payload) => {
        events.push(`login:${payload.user_id}`);
      },
      logout: async () => {
        events.push("logout");
      },
      maximize: () => undefined,
    });

    await controller.syncSession("a@example.com::live");
    current = "u2";
    await controller.syncSession("b@example.com::live");

    assert.deepEqual(events, ["login:u1", "logout", "login:u2"]);
    assert.equal(controller.getState().identifiedUserId, "u2");
  });

  it("serializes concurrent sync/openChat calls", async () => {
    let inFlightLoads = 0;
    let maxLoads = 0;
    let fetchCount = 0;

    const controller = createTawkSessionController({
      ensureLoaded: async () => {
        inFlightLoads += 1;
        maxLoads = Math.max(maxLoads, inFlightLoads);
        await new Promise((r) => setTimeout(r, 10));
        inFlightLoads -= 1;
      },
      fetchIdentity: async () => {
        fetchCount += 1;
        return identity("u1");
      },
      login: async () => {
        await new Promise((r) => setTimeout(r, 5));
      },
      logout: async () => undefined,
      maximize: () => undefined,
    });

    await Promise.all([
      controller.syncSession("a@example.com::live"),
      controller.openChat("a@example.com::live"),
      controller.syncSession("a@example.com::live"),
    ]);

    assert.equal(maxLoads, 1);
    // openChat força refresh da Identity API após o primeiro sync.
    assert.equal(fetchCount, 2);
    assert.equal(controller.getState().identifiedUserId, "u1");
  });

  it("openChat without session does not login", async () => {
    let fetchCount = 0;
    let maximizeCount = 0;
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        fetchCount += 1;
        return identity("u1");
      },
      login: async () => undefined,
      logout: async () => undefined,
      maximize: () => {
        maximizeCount += 1;
      },
    });

    const result = await controller.openChat(null);
    assert.equal(result, "cleared");
    assert.equal(fetchCount, 0);
    assert.equal(maximizeCount, 0);
  });

  it("degrades on Identity API failure", async () => {
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        throw new Error("api down");
      },
      login: async () => undefined,
      logout: async () => undefined,
      maximize: () => undefined,
    });

    const result = await controller.syncSession("a@example.com::live");
    assert.equal(result, "unavailable");
    assert.equal(controller.getState().identifiedUserId, null);
  });

  it("degrades on Tawk login failure", async () => {
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => identity("u1"),
      login: async () => {
        throw new Error("tawk down");
      },
      logout: async () => undefined,
      maximize: () => undefined,
    });

    const result = await controller.syncSession("a@example.com::live");
    assert.equal(result, "unavailable");
    assert.equal(controller.getState().identifiedUserId, null);
  });

  it("logs out Tawk when Identity API fails after a prior identify", async () => {
    let shouldFail = false;
    let logoutCount = 0;
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        if (shouldFail) throw new Error("expired");
        return identity("u1");
      },
      login: async () => undefined,
      logout: async () => {
        logoutCount += 1;
      },
      maximize: () => undefined,
    });

    await controller.syncSession("a@example.com::live");
    shouldFail = true;
    const result = await controller.openChat("a@example.com::live");

    assert.equal(result, "unavailable");
    assert.equal(logoutCount, 1);
    assert.equal(controller.getState().identifiedUserId, null);
  });

  it("openChat force-refetches identity even when already identified", async () => {
    let fetchCount = 0;
    let loginCount = 0;
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => {
        fetchCount += 1;
        return identity("u1");
      },
      login: async () => {
        loginCount += 1;
      },
      logout: async () => undefined,
      maximize: () => undefined,
    });

    await controller.syncSession("a@example.com::live");
    await controller.openChat("a@example.com::live");

    assert.equal(fetchCount, 2);
    assert.equal(loginCount, 2);
    assert.equal(controller.getState().identifiedUserId, "u1");
  });

  it("logout clears previous identity", async () => {
    let logoutCount = 0;
    const controller = createTawkSessionController({
      ensureLoaded: async () => undefined,
      fetchIdentity: async () => identity("u1"),
      login: async () => undefined,
      logout: async () => {
        logoutCount += 1;
      },
      maximize: () => undefined,
    });

    await controller.syncSession("a@example.com::live");
    await controller.logout();
    assert.equal(logoutCount, 1);
    assert.equal(controller.getState().identifiedUserId, null);
    assert.equal(controller.getState().boundSessionKey, null);
  });
});
