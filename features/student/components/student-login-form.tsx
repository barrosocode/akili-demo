"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { DevQuickAccessPanel } from "@/features/auth/components/dev-quick-access-panel";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function applyDevLoginProfile(profile: DevLoginProfile) {
    setEmail(profile.email);
    setPassword(profile.password);
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError("Informe e-mail e senha válidos.");
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
          ? (err.detail ?? err.title)
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
        <p>Entre com sua conta de estudante para acessar os materiais.</p>

        {error ? (
          <p className="text-danger" role="alert">
            {error}
          </p>
        ) : null}

        <div className="form-group mb-3">
          <label htmlFor="student-email">E-mail</label>
          <input
            id="student-email"
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
