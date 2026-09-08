"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { acceptInviteSchema } from "@/features/auth/schemas/auth.schema";
import { authBff } from "@/services/bff/auth.bff";
import { BffClientError } from "@/services/bff/client";

type FormValues = z.infer<typeof acceptInviteSchema>;

export function AcceptGuardianInviteForm() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = typeof params.token === "string" ? params.token : "";

  const form = useForm<FormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token,
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await authBff.acceptInvite({
        token: values.token || token,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      router.replace("/signin?invite=1");
    } catch (error) {
      const message =
        error instanceof BffClientError
          ? (error.detail ?? error.errors?.token ?? error.title)
          : "Não foi possível aceitar o convite.";
      form.setError("root", { message });
    }
  }

  if (!token) {
    return (
      <p style={{ color: "red" }}>
        <strong>Convite inválido. Abra o link completo enviado por e-mail.</strong>
      </p>
    );
  }

  return (
    <form
      className="form-style3"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      {form.formState.errors.root ? (
        <p style={{ color: "red" }}>
          <strong>{form.formState.errors.root.message}</strong>
        </p>
      ) : null}
      <input type="hidden" {...form.register("token")} />
      <div className="row">
        <div className="col-md-6 form-group">
          <label htmlFor="invite-password">Nova senha</label>
          <input
            id="invite-password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <span className="text-danger">
              {form.formState.errors.password.message}
            </span>
          ) : null}
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="invite-password-confirm">Confirmar senha</label>
          <input
            id="invite-password-confirm"
            type="password"
            autoComplete="new-password"
            {...form.register("password_confirmation")}
          />
          {form.formState.errors.password_confirmation ? (
            <span className="text-danger">
              {form.formState.errors.password_confirmation.message}
            </span>
          ) : null}
        </div>
        <div className="col-12 form-group">
          <button
            className="vs-btn"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Salvando..."
              : "Criar senha e continuar"}
          </button>
        </div>
        <div className="col-12 form-group">
          <Link href="/signin">Já tenho conta — entrar</Link>
        </div>
      </div>
    </form>
  );
}
