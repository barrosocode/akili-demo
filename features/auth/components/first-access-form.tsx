"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import {
  firstAccessRequestSchema,
  firstAccessVerifySchema,
} from "@/features/auth/schemas/auth.schema";
import { authBff } from "@/services/bff/auth.bff";
import { BffClientError } from "@/services/bff/client";

type RequestValues = z.infer<typeof firstAccessRequestSchema>;
type VerifyValues = z.infer<typeof firstAccessVerifySchema>;

export function FirstAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const [step, setStep] = useState<"request" | "verify">(
    initialEmail ? "verify" : "request"
  );
  const [email, setEmail] = useState(initialEmail);
  const [info, setInfo] = useState<string | null>(null);

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(firstAccessRequestSchema),
    defaultValues: { email: initialEmail },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(firstAccessVerifySchema),
    defaultValues: {
      email: initialEmail,
      code: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onRequest(values: RequestValues) {
    try {
      setInfo(null);
      const response = await authBff.requestFirstAccessOtp(values);
      setEmail(values.email);
      verifyForm.setValue("email", values.email);
      setStep("verify");
      setInfo(response.message);
    } catch (error) {
      const message =
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : "Não foi possível enviar o código.";
      requestForm.setError("root", { message });
    }
  }

  async function onVerify(values: VerifyValues) {
    try {
      setInfo(null);
      await authBff.verifyFirstAccessOtp(values);
      router.replace(
        `/signin?firstAccess=1&email=${encodeURIComponent(values.email)}`
      );
    } catch (error) {
      const message =
        error instanceof BffClientError
          ? (error.detail ?? error.errors?.code ?? error.title)
          : "Não foi possível validar o código.";
      verifyForm.setError("root", { message });
    }
  }

  async function onResend() {
    if (!email) return;
    try {
      setInfo(null);
      const response = await authBff.requestFirstAccessOtp({ email });
      setInfo(response.message);
    } catch (error) {
      const message =
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : "Não foi possível reenviar o código.";
      verifyForm.setError("root", { message });
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
        <div className="row justify-content-center">
          <div className="col-xl-7 col-xxl-6 align-self-center">
            <h2 className="sec-title mb-3">Primeiro acesso</h2>
            <p className="mb-4">
              Informe o e-mail do convite, receba o código e defina sua senha
              para entrar no portal.
            </p>

            {info ? (
              <p className="alert alert-info" role="status">
                {info}
              </p>
            ) : null}

            {step === "request" ? (
              <form
                className="form-style3"
                onSubmit={requestForm.handleSubmit(onRequest)}
                noValidate
              >
                {requestForm.formState.errors.root ? (
                  <p style={{ color: "red" }}>
                    <strong>{requestForm.formState.errors.root.message}</strong>
                  </p>
                ) : null}
                <div className="form-group">
                  <label htmlFor="first-access-email">
                    E-mail<span className="required" />
                  </label>
                  <input
                    id="first-access-email"
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
                <div className="form-group">
                  <button
                    className="vs-btn"
                    type="submit"
                    disabled={requestForm.formState.isSubmitting}
                  >
                    {requestForm.formState.isSubmitting
                      ? "Enviando..."
                      : "Enviar código"}
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="form-style3"
                onSubmit={verifyForm.handleSubmit(onVerify)}
                noValidate
              >
                {verifyForm.formState.errors.root ? (
                  <p style={{ color: "red" }}>
                    <strong>{verifyForm.formState.errors.root.message}</strong>
                  </p>
                ) : null}
                <input type="hidden" {...verifyForm.register("email")} />
                <div className="form-group">
                  <label htmlFor="first-access-code">
                    Código<span className="required" />
                  </label>
                  <input
                    id="first-access-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    {...verifyForm.register("code")}
                  />
                  {verifyForm.formState.errors.code ? (
                    <span className="text-danger">
                      {verifyForm.formState.errors.code.message}
                    </span>
                  ) : null}
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label htmlFor="first-access-password">Nova senha</label>
                    <input
                      id="first-access-password"
                      type="password"
                      autoComplete="new-password"
                      {...verifyForm.register("password")}
                    />
                    {verifyForm.formState.errors.password ? (
                      <span className="text-danger">
                        {verifyForm.formState.errors.password.message}
                      </span>
                    ) : null}
                  </div>
                  <div className="col-md-6 form-group">
                    <label htmlFor="first-access-password-confirmation">
                      Confirmar senha
                    </label>
                    <input
                      id="first-access-password-confirmation"
                      type="password"
                      autoComplete="new-password"
                      {...verifyForm.register("password_confirmation")}
                    />
                    {verifyForm.formState.errors.password_confirmation ? (
                      <span className="text-danger">
                        {
                          verifyForm.formState.errors.password_confirmation
                            .message
                        }
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="form-group d-flex gap-3 flex-wrap">
                  <button
                    className="vs-btn"
                    type="submit"
                    disabled={verifyForm.formState.isSubmitting}
                  >
                    {verifyForm.formState.isSubmitting
                      ? "Validando..."
                      : "Definir senha"}
                  </button>
                  <button
                    className="vs-btn"
                    type="button"
                    onClick={() => void onResend()}
                  >
                    Reenviar código
                  </button>
                </div>
              </form>
            )}

            <p className="mt-4">
              Já concluiu o primeiro acesso?{" "}
              <Link href="/signin">Ir para o login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
