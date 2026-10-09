"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { DevQuickAccessPanel } from "@/features/auth/components/dev-quick-access-panel";
import { studentLoginSchema } from "@/features/auth/schemas/auth.schema";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import {
  DEV_LOGIN_STUDENT_PROFILES,
  type DevLoginProfile,
} from "@/lib/auth/dev-login-profiles";
import { resolveUnifiedLoginRedirect } from "@/lib/auth/post-login-path";
import { BffClientError, bffClient } from "@/services/bff/client";
import type { LoginSuccessPayload } from "@/types/auth-login";

interface StudentLoginFormProps {
  showDevQuickAccess?: boolean;
}

export function StudentLoginForm({
  showDevQuickAccess = false,
}: StudentLoginFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function applyDevLoginProfile(profile: DevLoginProfile) {
    setLogin(profile.login ?? "");
    setPassword(profile.password);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = studentLoginSchema.safeParse({ login, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Informe usuário e senha.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bffClient<LoginSuccessPayload>(
        "/api/student/auth/login",
        {
          method: "POST",
          body: parsed.data,
        }
      );

      const destination = resolveUnifiedLoginRedirect(result, next);
      window.location.assign(destination);
    } catch (err) {
      setError(
        err instanceof BffClientError
          ? (err.errors?.login ?? err.errors?.password ?? err.detail ?? err.title)
          : getUserFacingApiMessage(err)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form className="form-style3" onSubmit={handleSubmit}>
        <h2 className="blog-title">Área do aluno</h2>
        <p>Entre com o usuário criado pelo responsável e a sua senha.</p>

        {error ? (
          <p className="text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-group mb-3">
          <label htmlFor="student-login">Usuário</label>
          <input
            id="student-login"
            type="text"
            className="form-control"
            autoComplete="username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="student-password">Senha</label>
          <input
            id="student-password"
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="vs-btn" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {showDevQuickAccess ? (
        <DevQuickAccessPanel
          profiles={DEV_LOGIN_STUDENT_PROFILES}
          disabled={isSubmitting}
          onSelect={applyDevLoginProfile}
        />
      ) : null}
    </>
  );
}
