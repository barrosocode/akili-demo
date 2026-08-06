"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";

export function StudentLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/aluno";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch("/api/student/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new BffClientError({
          title: payload?.title ?? "Erro no login",
          status: response.status,
          detail: payload?.detail ?? payload?.message,
        });
      }

      router.replace(next.startsWith("/aluno") ? next : "/aluno");
      router.refresh();
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
  );
}
