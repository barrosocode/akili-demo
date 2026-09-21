import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveSupportActions } from "./map-route-target.ts";
import type { SupportFaqAction } from "../../../types/domain/support-faq.ts";

function action(
  partial: Partial<SupportFaqAction> &
    Pick<SupportFaqAction, "type" | "target" | "label">
): SupportFaqAction {
  return {
    uuid: partial.uuid ?? "a1",
    position: partial.position ?? 1,
    ...partial,
  };
}

describe("resolveSupportActions", () => {
  it("maps guardian and student route targets", () => {
    const resolved = resolveSupportActions([
      action({ type: "route", target: "guardian_children", label: "Filhos" }),
      action({ type: "route", target: "guardian_signin", label: "Entrar" }),
      action({ type: "route", target: "guardian_first_access", label: "Primeiro acesso" }),
      action({ type: "route", target: "guardian_forgot_password", label: "Senha" }),
      action({ type: "route", target: "guardian_profile", label: "Dados" }),
      action({ type: "route", target: "guardian_reports", label: "Relatórios" }),
      action({ type: "route", target: "student_login", label: "Login aluno" }),
      action({ type: "route", target: "student_materials", label: "Materiais" }),
    ]);

    assert.deepEqual(resolved, [
      { kind: "internal", href: "/children", label: "Filhos" },
      { kind: "internal", href: "/signin", label: "Entrar" },
      { kind: "internal", href: "/first-access", label: "Primeiro acesso" },
      { kind: "internal", href: "/forgot-password", label: "Senha" },
      { kind: "internal", href: "/profile", label: "Dados" },
      { kind: "internal", href: "/relatorios", label: "Relatórios" },
      { kind: "internal", href: "/aluno/entrar", label: "Login aluno" },
      { kind: "internal", href: "/aluno/materiais", label: "Materiais" },
    ]);
  });

  it("omits admin, teacher and school route targets", () => {
    const resolved = resolveSupportActions([
      action({ type: "route", target: "admin_dashboard", label: "Painel" }),
      action({ type: "route", target: "admin_choose_school", label: "Unidade" }),
      action({ type: "route", target: "school_students", label: "Alunos" }),
      action({ type: "route", target: "teacher_classrooms", label: "Turmas" }),
    ]);

    assert.deepEqual(resolved, []);
  });

  it("allows https and mailto external urls only", () => {
    const resolved = resolveSupportActions([
      action({
        type: "external_url",
        target: "https://akili.example/help",
        label: "Docs",
      }),
      action({
        type: "external_url",
        target: "mailto:suporte@akili.example",
        label: "Email",
      }),
      action({
        type: "external_url",
        target: "javascript:alert(1)",
        label: "Bad",
      }),
      action({
        type: "external_url",
        target: "http://insecure.example",
        label: "Http",
      }),
    ]);

    assert.deepEqual(resolved, [
      {
        kind: "external",
        href: "https://akili.example/help",
        label: "Docs",
      },
      {
        kind: "external",
        href: "mailto:suporte@akili.example",
        label: "Email",
      },
    ]);
  });

  it("skips blank labels and missing action lists", () => {
    assert.deepEqual(resolveSupportActions(undefined), []);
    assert.deepEqual(resolveSupportActions(null), []);
    assert.deepEqual(
      resolveSupportActions([
        action({ type: "route", target: "guardian_children", label: "   " }),
      ]),
      []
    );
  });
});
