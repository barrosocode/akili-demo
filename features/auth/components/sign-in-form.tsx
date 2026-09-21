"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { DevQuickAccessPanel } from "@/features/auth/components/dev-quick-access-panel";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import {
  DEV_LOGIN_PROFILES,
  type DevLoginProfile,
} from "@/lib/auth/dev-login-profiles";
import { resolveUnifiedLoginRedirect } from "@/lib/auth/post-login-path";
import { useLoginMutation } from "@/services/queries/auth.mutations";
import { BffClientError } from "@/services/bff/client";

type LoginFormValues = z.infer<typeof loginSchema>;

interface SignInFormProps {
  showDevQuickAccess?: boolean;
}

/**
 * Login Kiddino (PORTAL-003) — form-style3 + BFF.
 * Pós-sucesso: full navigation para o dashboard (`/` ou `?next=` seguro).
 */
export function SignInForm({ showDevQuickAccess = false }: SignInFormProps) {
  const searchParams = useSearchParams();
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function applyDevLoginProfile(profile: DevLoginProfile) {
    setValue("email", profile.email, { shouldDirty: true, shouldTouch: true });
    setValue("password", profile.password, { shouldDirty: true, shouldTouch: true });
    clearErrors();
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await login.mutateAsync(values);
      const destination = resolveUnifiedLoginRedirect(
        result,
        searchParams.get("next")
      );
      window.location.assign(destination);
    } catch (error) {
      if (error instanceof BffClientError && error.status === 422) {
        const detail = `${error.detail ?? ""} ${error.errors?.email ?? ""}`.toLowerCase();
        if (detail.includes("primeiro acesso")) {
          window.location.assign(
            `/first-access?email=${encodeURIComponent(values.email)}`
          );
          return;
        }
      }
      const message =
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : "Não foi possível entrar. Verifique seus dados.";
      setError("root", { message });
    }
  }

  return (
    <section
      className="space-top"
      style={{
        backgroundImage: "url('/assets/img/bg/bg-con-1-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-auto col-xxl-6">
            <div className="img-box6">
              <div className="img-1 mega-hover">
                <Image
                  src="/assets/images/dashboard/menino-01.png"
                  alt="Menino no computador"
                  width={400}
                  height={480}
                  priority
                />
              </div>
              <div className="img-2 mega-hover">
                <Image
                  src="/assets/images/dashboard/menina-01.png"
                  alt="Menina no computador"
                  width={400}
                  height={480}
                  priority
                />
              </div>
            </div>
          </div>
          <div className="col-xl col-xxl-6 align-self-center">
            <h2 className="sec-title mb-3">Login</h2>
            {searchParams.get("error") === "access-denied" ? (
              <p className="alert alert-warning" role="alert">
                Você não tem permissão para acessar esta área do portal.
              </p>
            ) : null}
            {searchParams.get("firstAccess") === "1" ? (
              <p className="alert alert-success" role="status">
                Senha definida com sucesso. Entre com seu e-mail e a nova senha.
              </p>
            ) : null}
            {errors.root ? (
              <p style={{ color: "red" }}>
                <strong>{errors.root.message}</strong>
              </p>
            ) : null}
            <form
              className="form-style3"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="row justify-content-between">
                <div className="col-md-6 form-group">
                  <label htmlFor="signin-email">
                    E-mail ou Usuário<span className="required" />
                  </label>
                  <input
                    id="signin-email"
                    type="text"
                    autoComplete="username"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <span className="text-danger">{errors.email.message}</span>
                  ) : null}
                </div>
                <div className="col-md-6 form-group">
                  <label htmlFor="signin-password">Senha</label>
                  <input
                    id="signin-password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                  />
                  {errors.password ? (
                    <span className="text-danger">{errors.password.message}</span>
                  ) : null}
                </div>
                <div className="col-auto align-self-center form-group">
                  <label>
                    <Link href="/forgot-password">Esqueceu a Senha?</Link>
                  </label>
                  <label>
                    <Link href="/cadastro">Não é cadastrado?</Link>
                  </label>
                </div>
                <div className="col-auto form-group">
                  <button
                    className="vs-btn"
                    type="submit"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Entrando..." : "Entrar"}
                  </button>
                </div>
              </div>
            </form>
            {showDevQuickAccess ? (
              <DevQuickAccessPanel
                profiles={DEV_LOGIN_PROFILES}
                disabled={login.isPending}
                onSelect={applyDevLoginProfile}
              />
            ) : null}
            <p className="mt-4">
              É uma escola?{" "}
              <a
                href={
                  process.env.NEXT_PUBLIC_ADMIN_APP_URL ??
                  process.env.ADMIN_APP_URL ??
                  "http://localhost:3001"
                }
              >
                Acesse o painel administrativo
              </a>
            </p>
            <p className="mt-2">
              Operador de suporte?{" "}
              <Link href="/suporte/entrar">Acesso atendimento</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
