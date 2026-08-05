"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { useLoginMutation } from "@/services/queries/auth.mutations";
import { BffClientError } from "@/services/bff/client";

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Login Kiddino (PORTAL-003) — form-style3 + BFF.
 */
export function SignInForm() {
  const router = useRouter();
  const login = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login.mutateAsync(values);
      router.push("/");
      router.refresh();
    } catch (error) {
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
          </div>
        </div>
      </div>
    </section>
  );
}
