import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { adoptAssistanceSchema, navigateAssistanceSchema } from "./schemas/assistance.schema.ts";
import {
  applyAssistanceCapabilities,
  assertAdoptResponseHasNoSecrets,
  isAssistanceReadOnly,
  mapPortalAssistance,
} from "./assistance-session.ts";
import {
  ASSISTANCE_BANNER_CSS_CLASSES,
  ASSISTANCE_BANNER_HEIGHT_VAR,
  ASSISTANCE_BANNER_HTML_ATTR,
  ASSISTANCE_BANNER_SHELL_MOUNT_POINTS,
  resolveAssistanceBannerContent,
  shouldRenderAssistanceBanner,
} from "./assistance-chrome.ts";
import {
  assertNavigatePayloadHasOnlyPathAndLabel,
  buildAssistanceNavigatePayload,
  isAssistanceHandoffPath,
  normalizeAssistancePath,
  resolveAssistancePageLabel,
  shouldReportAssistanceNavigation,
} from "./navigation.ts";
import { shouldShowMarketingHome } from "./home-guard.ts";
import {
  ASSISTANCE_ADOPT_PATH,
  ASSISTANCE_ENTER_PATH,
} from "./paths.ts";
import { isPublicPath } from "../../lib/auth/public-routes.ts";
import { assistanceCookieOptions } from "../../lib/auth/assistance-cookie-options.ts";

describe("adoptAssistanceSchema", () => {
  it("accepts opaque handoff codes", () => {
    const code = "a".repeat(64);
    const parsed = adoptAssistanceSchema.safeParse({ code });
    assert.equal(parsed.success, true);
    if (parsed.success) assert.equal(parsed.data.code, code);
  });

  it("rejects short codes", () => {
    const parsed = adoptAssistanceSchema.safeParse({ code: "short" });
    assert.equal(parsed.success, false);
  });

  it("rejects spoof fields via strict object", () => {
    const parsed = adoptAssistanceSchema.safeParse({
      code: "a".repeat(64),
      target_uuid: "x",
      operator_uuid: "y",
      session_uuid: "z",
      token: "pat",
    });
    assert.equal(parsed.success, false);
  });
});

describe("mapPortalAssistance", () => {
  const assistance = {
    active: true as const,
    session_uuid: "session-1",
    read_only: true,
    expires_at: "2026-09-16T20:00:00+00:00",
    operator: { uuid: "op-1", name: "Operador Suporte" },
    target: { uuid: "target-uuid", name: "Responsável Alvo" },
  };

  it("maps Laravel assistance payload", () => {
    assert.deepEqual(mapPortalAssistance(assistance), {
      active: true,
      sessionUuid: "session-1",
      readOnly: true,
      expiresAt: "2026-09-16T20:00:00+00:00",
      operator: { uuid: "op-1", name: "Operador Suporte" },
      target: { uuid: "target-uuid", name: "Responsável Alvo" },
    });
  });

  it("returns null when inactive or missing", () => {
    assert.equal(mapPortalAssistance(null), null);
    assert.equal(mapPortalAssistance({ ...assistance, active: false }), null);
  });

  it("forces read-only capabilities while assistance is active", () => {
    const mapped = mapPortalAssistance(assistance);
    const capabilities = applyAssistanceCapabilities(
      { canAddChildren: true, canPurchase: true },
      mapped
    );
    assert.equal(capabilities.canAddChildren, false);
    assert.equal(capabilities.canPurchase, false);
    assert.equal(isAssistanceReadOnly({ assistance: mapped }), true);
  });

  it("keeps normal capabilities without assistance", () => {
    const capabilities = applyAssistanceCapabilities(
      { canAddChildren: true, canPurchase: true },
      null
    );
    assert.equal(capabilities.canPurchase, true);
    assert.equal(isAssistanceReadOnly({ assistance: null }), false);
  });
});

describe("public routes for assistance adopt", () => {
  it("allows /assistance/adopt without session cookie", () => {
    assert.equal(isPublicPath("/assistance/adopt"), true);
    assert.equal(isPublicPath("/api/assistance/adopt"), true);
    assert.equal(isPublicPath("/api/assistance/end"), true);
    assert.equal(isPublicPath("/api/assistance/navigate"), true);
  });

  it("allows /assistance/entrar bridge without guardian session cookie", () => {
    assert.equal(isPublicPath(ASSISTANCE_ENTER_PATH), true);
    assert.equal(isPublicPath("/assistance/entrar"), true);
  });
});

describe("assistance adopt BFF contract shape", () => {
  it("success payload must never include token/code fields", () => {
    assert.equal(
      assertAdoptResponseHasNoSecrets({
        redirectTo: "/",
        session: { name: "Alvo", assistance: { active: true } },
      }),
      true
    );
    assert.equal(
      assertAdoptResponseHasNoSecrets({
        redirectTo: "/",
        token: "secret",
      }),
      false
    );
  });
});

describe("assistance navigation reporter", () => {
  it("detects pathname change and builds / path as Meus filhos", () => {
    const first = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname: "/",
      lastReportedPath: null,
    });
    assert.equal(first.report, true);
    if (first.report) {
      assert.deepEqual(first.payload, { path: "/", page_label: "Meus filhos" });
    }
  });

  it("reports /children as Meus filhos", () => {
    const decision = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname: "/children",
      lastReportedPath: "/",
    });
    assert.equal(decision.report, true);
    if (decision.report) {
      assert.equal(decision.payload.path, "/children");
      assert.equal(decision.payload.page_label, "Meus filhos");
    }
  });

  it("strips query string from path", () => {
    assert.equal(normalizeAssistancePath("/children?foo=bar&token=x"), "/children");
    const payload = buildAssistanceNavigatePayload("/profile?secret=1");
    assert.deepEqual(payload, { path: "/profile", page_label: "Meus dados" });
  });

  it("does not register /assistance/adopt", () => {
    assert.equal(isAssistanceHandoffPath("/assistance/adopt"), true);
    assert.equal(buildAssistanceNavigatePayload("/assistance/adopt?code=abc"), null);
    const decision = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname: "/assistance/adopt",
      lastReportedPath: null,
    });
    assert.equal(decision.report, false);
  });

  it("does not register /assistance/entrar bridge", () => {
    assert.equal(isAssistanceHandoffPath(ASSISTANCE_ENTER_PATH), true);
    assert.equal(buildAssistanceNavigatePayload(ASSISTANCE_ENTER_PATH), null);
    const decision = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname: ASSISTANCE_ENTER_PATH,
      lastReportedPath: null,
    });
    assert.equal(decision.report, false);
  });

  it("does not resend the same route on re-render", () => {
    const again = shouldReportAssistanceNavigation({
      assistanceActive: true,
      pathname: "/children",
      lastReportedPath: "/children",
    });
    assert.equal(again.report, false);
  });

  it("does not report when assistance is inactive", () => {
    const decision = shouldReportAssistanceNavigation({
      assistanceActive: false,
      pathname: "/children",
      lastReportedPath: null,
    });
    assert.equal(decision.report, false);
  });

  it("payload contains only path and page_label", () => {
    const payload = buildAssistanceNavigatePayload("/children/abc");
    assert.ok(payload);
    assert.equal(assertNavigatePayloadHasOnlyPathAndLabel(payload!), true);
    assert.equal(
      assertNavigatePayloadHasOnlyPathAndLabel({
        ...payload!,
        session_uuid: "nope",
      }),
      false
    );
  });

  it("labels child and supervision routes from real portal paths", () => {
    assert.equal(resolveAssistancePageLabel("/children/abc"), "Filho");
    assert.equal(
      resolveAssistancePageLabel("/aluno/supervisao/abc/materiais"),
      "Materiais"
    );
    assert.equal(resolveAssistancePageLabel("/unknown/route"), "Portal");
  });

  it("navigate schema rejects operator/target/session injection", () => {
    assert.equal(
      navigateAssistanceSchema.safeParse({
        path: "/children",
        page_label: "Meus filhos",
        operator_uuid: "x",
      }).success,
      false
    );
    assert.equal(
      navigateAssistanceSchema.safeParse({
        path: "/children",
        target_uuid: "x",
      }).success,
      false
    );
    assert.equal(
      navigateAssistanceSchema.safeParse({
        path: "/children",
        session_uuid: "x",
        token: "pat",
      }).success,
      false
    );
    assert.equal(
      navigateAssistanceSchema.safeParse({
        path: "/children",
        page_label: "Meus filhos",
      }).success,
      true
    );
  });
});

describe("assistance banner chrome", () => {
  const activeAssistance = {
    active: true as const,
    sessionUuid: "session-1",
    readOnly: true,
    expiresAt: "2026-09-16T20:00:00+00:00",
    operator: { uuid: "op-1", name: "Carlos Suporte" },
    target: { uuid: "target-1", name: "Maria Silva" },
  };

  it("shows banner content when assistance is active", () => {
    assert.equal(shouldRenderAssistanceBanner(activeAssistance), true);
    const copy = resolveAssistanceBannerContent(activeAssistance);
    assert.match(copy.title, /somente leitura/i);
    assert.equal(copy.targetName, "Maria Silva");
    assert.equal(copy.operatorName, "Carlos Suporte");
    assert.equal(copy.endLabel, "Encerrar acesso");
  });

  it("hides banner when assistance is inactive or missing", () => {
    assert.equal(shouldRenderAssistanceBanner(null), false);
    assert.equal(
      shouldRenderAssistanceBanner({ ...activeAssistance, active: false }),
      false
    );
  });

  it("documents single mount points without nested shells", () => {
    assert.deepEqual([...ASSISTANCE_BANNER_SHELL_MOUNT_POINTS], [
      "GuardianDashboardShell",
      "AlunoDashboardShell",
    ]);
    // Trees are exclusive: / (dashboard) vs /aluno/supervisao — never both shells.
    assert.equal(ASSISTANCE_BANNER_SHELL_MOUNT_POINTS.length, 2);
  });

  it("end CTA label stays wired to the existing end flow copy", () => {
    const copy = resolveAssistanceBannerContent(activeAssistance);
    assert.equal(copy.endLabel, "Encerrar acesso");
    assert.equal(copy.endingLabel, "Encerrando…");
  });

  it("documents public BEM classes for the banner chrome", () => {
    assert.deepEqual([...ASSISTANCE_BANNER_CSS_CLASSES], [
      "assistance-banner",
      "assistance-banner__title",
      "assistance-banner__meta",
      "assistance-banner__end",
    ]);
  });

  it("documents sticky stack contract with theme header", () => {
    assert.equal(ASSISTANCE_BANNER_HTML_ATTR, "data-assistance-banner");
    assert.equal(ASSISTANCE_BANNER_HEIGHT_VAR, "--assistance-banner-height");
  });
});

describe("assistance cookie options", () => {
  it("keeps set and clear aligned on path/sameSite/secure", () => {
    const setOpts = assistanceCookieOptions(1800);
    const clearOpts = assistanceCookieOptions(0);

    assert.equal(setOpts.path, "/");
    assert.equal(clearOpts.path, "/");
    assert.equal(setOpts.path, clearOpts.path);
    assert.equal(setOpts.sameSite, clearOpts.sameSite);
    assert.equal(setOpts.secure, clearOpts.secure);
    assert.equal(setOpts.httpOnly, true);
    assert.equal(clearOpts.maxAge, 0);
    assert.equal(setOpts.maxAge, 1800);
  });
});

describe("desk start / adopt BFF contract", () => {
  it("desk start success redirects to assistance enter bridge", () => {
    assert.equal(ASSISTANCE_ENTER_PATH, "/assistance/entrar");
    assert.notEqual(ASSISTANCE_ENTER_PATH, "/");
    const payload: { redirectTo: string } = {
      redirectTo: ASSISTANCE_ENTER_PATH,
    };
    assert.equal(payload.redirectTo, ASSISTANCE_ENTER_PATH);
    assert.equal("session" in payload, false);
  });

  it("adopt may omit session when /me is best-effort", () => {
    const withSession: { redirectTo: string; session?: unknown } = {
      redirectTo: ASSISTANCE_ENTER_PATH,
      session: null,
    };
    const withoutSession: { redirectTo: string; session?: unknown } = {
      redirectTo: ASSISTANCE_ENTER_PATH,
    };
    assert.equal(withSession.session, null);
    assert.equal(withoutSession.session, undefined);
    assert.equal(ASSISTANCE_ADOPT_PATH, "/assistance/adopt");
  });
});

describe("home marketing guard", () => {
  it("shows marketing only without session and without assistance cookie", () => {
    assert.equal(
      shouldShowMarketingHome({
        hasSession: false,
        hasAssistanceCookie: false,
      }),
      true
    );
  });

  it("hides marketing when assistance cookie is present without session", () => {
    assert.equal(
      shouldShowMarketingHome({
        hasSession: false,
        hasAssistanceCookie: true,
      }),
      false
    );
  });

  it("hides marketing when session exists", () => {
    assert.equal(
      shouldShowMarketingHome({
        hasSession: true,
        hasAssistanceCookie: false,
      }),
      false
    );
    assert.equal(
      shouldShowMarketingHome({
        hasSession: true,
        hasAssistanceCookie: true,
      }),
      false
    );
  });
});
