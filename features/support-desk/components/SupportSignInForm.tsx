"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { resolveUnifiedLoginRedirect } from "@/lib/auth/post-login-path";
import { supportDeskBff } from "@/services/bff/support-desk.bff";
import { BffClientError } from "@/services/bff/client";

type LoginFormValues = z.infer<typeof loginSchema>;

export function SupportSignInForm() {
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const result = await supportDeskBff.login(values.email, values.password);
      const destination = resolveUnifiedLoginRedirect(
        result,
        searchParams.get("next")
      );
      window.location.assign(destination);
    } catch (error) {
      if (error instanceof BffClientError) {
        const fieldMessage =
          error.errors?.email?.trim() || error.errors?.tenant_id?.trim();
        if (fieldMessage) {
          setError("email", { message: fieldMessage });
          return;
        }
        setError("root", {
          message: error.detail ?? error.title,
        });
        return;
      }
      setError("root", {
        message: "Não foi possível entrar. Verifique seus dados.",
      });
    }
  }

  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5 align-self-center">
            <h2 className="sec-title mb-3">Atendimento</h2>
            <p className="mb-4">
              Entre com a conta de suporte para buscar responsáveis e iniciar o
              modo de visualização.
            </p>
            {errors.root ? (
              <p className="alert alert-danger" role="alert">
                <strong>{errors.root.message}</strong>
              </p>
            ) : null}
            <form
              className="form-style3"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="support-email">
                  E-mail<span className="required" />
                </label>
                <input
                  id="support-email"
                  type="email"
                  autoComplete="username"
                  {...register("email")}
                />
                {errors.email ? (
                  <span className="text-danger">{errors.email.message}</span>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="support-password">Senha</label>
                <input
                  id="support-password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password ? (
                  <span className="text-danger">{errors.password.message}</span>
                ) : null}
              </div>
              <div className="form-group">
                <button className="vs-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>
            <p className="mt-4">
              Responsável ou aluno?{" "}
              <Link href="/signin">Voltar ao login do portal</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
