"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import {
  forgotPasswordRequestSchema,
  forgotPasswordResetSchema,
} from "@/features/auth/schemas/auth.schema";

type RequestValues = z.infer<typeof forgotPasswordRequestSchema>;
type ResetValues = z.infer<typeof forgotPasswordResetSchema>;

type ForgotPasswordFormProps = {
  /** Token de reset na query (?token=) — modo alterar senha. */
  resetToken?: string;
};

/**
 * Recuperar / alterar senha Kiddino (PORTAL-004).
 * Pedido de e-mail: feedback honesto (BFF de reset ainda não disponível).
 */
export function ForgotPasswordForm({ resetToken }: ForgotPasswordFormProps) {
  const isResetMode = Boolean(resetToken);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: { password: "", password_confirmation: "" },
  });

  async function onRequest(values: RequestValues) {
    setFeedback(null);
    setFeedbackError(null);
    // TODO(api): integrar POST /api/auth/forgot-password quando disponível
    void values;
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    setFeedback(
      "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha. Em caso de dúvida, fale conosco pelo contato do site.",
    );
    requestForm.reset();
  }

  async function onReset(values: ResetValues) {
    setFeedback(null);
    setFeedbackError(null);
    void values;
    void resetToken;
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    setFeedbackError(
      "A redefinição de senha ainda não está disponível nesta versão. Use o pedido por e-mail ou fale com o suporte.",
    );
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
                  src="/assets/img/about/con-1-1.jpg"
                  alt=""
                  width={480}
                  height={360}
                  aria-hidden
                />
              </div>
              <div className="img-2 mega-hover">
                <Image
                  src="/assets/img/about/con-1-2.jpg"
                  alt=""
                  width={480}
                  height={360}
                  aria-hidden
                />
              </div>
            </div>
          </div>
          <div className="col-xl col-xxl-6 align-self-center">
            <h2 className="sec-title mb-3">
              {isResetMode ? "Nova senha" : "Recuperar senha"}
            </h2>
            {feedback ? (
              <p style={{ color: "green" }}>
                <strong>{feedback}</strong>
              </p>
            ) : null}
            {feedbackError ? (
              <p style={{ color: "red" }}>
                <strong>{feedbackError}</strong>
              </p>
            ) : null}

            {isResetMode ? (
              <form
                className="form-style3"
                onSubmit={resetForm.handleSubmit(onReset)}
                noValidate
              >
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="reset-password">Nova senha</label>
                    <input
                      id="reset-password"
                      type="password"
                      autoComplete="new-password"
                      {...resetForm.register("password")}
                    />
                    {resetForm.formState.errors.password ? (
                      <span className="text-danger">
                        {resetForm.formState.errors.password.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="reset-password-confirm">
                      Confirmar senha
                    </label>
                    <input
                      id="reset-password-confirm"
                      type="password"
                      autoComplete="new-password"
                      {...resetForm.register("password_confirmation")}
                    />
                    {resetForm.formState.errors.password_confirmation ? (
                      <span className="text-danger">
                        {
                          resetForm.formState.errors.password_confirmation
                            .message
                        }
                      </span>
                    ) : null}
                  </div>
                  <div className="col-auto form-group">
                    <button className="vs-btn" type="submit">
                      Salvar senha
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form
                className="form-style3"
                onSubmit={requestForm.handleSubmit(onRequest)}
                noValidate
              >
                <div className="row">
                  <div className="col-md-8 form-group">
                    <label htmlFor="forgot-email">E-mail</label>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      {...requestForm.register("email")}
                    />
                    {requestForm.formState.errors.email ? (
                      <span className="text-danger">
                        {requestForm.formState.errors.email.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-auto form-group align-self-end">
                    <button
                      className="vs-btn"
                      type="submit"
                      disabled={requestForm.formState.isSubmitting}
                    >
                      Enviar
                    </button>
                  </div>
                  <div className="col-12 form-group">
                    <Link href="/signin">Voltar ao login</Link>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
