"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateGuardianProfileSchema,
  type UpdateGuardianProfileValues,
} from "@/features/profile/schemas/profile.schema";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { formatPhoneInput } from "@/lib/masks/br";
import { formatCpfInput } from "@/lib/masks/cpf";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { useUpdateProfileMutation } from "@/services/queries/profile.mutations";
import { useGuardianProfileQuery } from "@/services/queries/profile.queries";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

/**
 * Perfil do responsável — dados via GET/PATCH /guardian/me (PORTAL-009).
 */
export function ProfilePage() {
  const { user, refetch } = useSession();
  const profileQuery = useGuardianProfileQuery();
  const updateProfile = useUpdateProfileMutation();
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateGuardianProfileValues>({
    resolver: zodResolver(updateGuardianProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      document: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    reset({
      name: profileQuery.data.name,
      phone: profileQuery.data.phone
        ? formatPhoneInput(profileQuery.data.phone)
        : "",
      document: profileQuery.data.document
        ? formatCpfInput(profileQuery.data.document)
        : "",
    });
  }, [profileQuery.data, reset]);

  async function onSubmit(values: UpdateGuardianProfileValues) {
    setSuccess(null);
    setErrorMsg(null);
    try {
      const updated = await updateProfile.mutateAsync(values);
      reset({
        name: updated.name,
        phone: updated.phone ? formatPhoneInput(updated.phone) : "",
        document: updated.document ? formatCpfInput(updated.document) : "",
      });
      refetch();
      setSuccess("Seus dados foram atualizados com sucesso.");
    } catch (error) {
      setErrorMsg(
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : getUserFacingApiMessage(error)
      );
    }
  }

  const displayName = profileQuery.data?.name || user?.name || "Responsável";
  const displayEmail = profileQuery.data?.email || user?.email || "";
  const avatarUrl = user?.avatarUrl ?? null;
  const isSubmitting = updateProfile.isPending;

  if (profileQuery.isLoading && !profileQuery.data) {
    return (
      <div className="blog-content" role="status">
        <h2 className="blog-title">Meus dados</h2>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  if (profileQuery.error && !profileQuery.data) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Meus dados</h2>
        <div className="alert alert-danger" role="alert">
          <strong>Não foi possível carregar seu cadastro.</strong>
          <p className="mb-0">
            {profileQuery.error instanceof BffClientError
              ? (profileQuery.error.detail ?? profileQuery.error.title)
              : getUserFacingApiMessage(profileQuery.error)}
          </p>
        </div>
        <p className="mt-3 mb-0">
          <button
            type="button"
            className="vs-btn"
            onClick={() => void profileQuery.refetch()}
          >
            Tentar novamente
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="blog-content">
      <div className="blog-meta">
        <h2 className="blog-title">Meus dados</h2>
      </div>
      <p>
        Mantenha seu cadastro atualizado para receber avisos e facilitar o
        contato da escola e do suporte Akili.
      </p>

      <div className="widget mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 72,
              height: 72,
              background: avatarUrl
                ? `center / cover no-repeat url(${avatarUrl})`
                : "var(--theme-color2)",
              color: "var(--white-color)",
              fontWeight: 700,
              fontSize: 22,
            }}
            aria-hidden
          >
            {avatarUrl ? null : initialsFromName(displayName)}
          </div>
          <div>
            <h3 className="widget_title mb-1">{displayName}</h3>
            {displayEmail ? <p className="mb-0">{displayEmail}</p> : null}
          </div>
        </div>
      </div>

      {success ? (
        <div className="alert alert-success" role="status">
          <strong>{success}</strong>
        </div>
      ) : null}
      {errorMsg ? (
        <div className="alert alert-danger" role="alert">
          <strong>{errorMsg}</strong>
        </div>
      ) : null}

      <form
        className="form-style3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="widget mb-4">
          <h3 className="widget_title">Dados pessoais</h3>
          <div className="row">
            <div className="col-12 form-group">
              <label htmlFor="profile-name">Nome completo</label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                placeholder="Ex.: Ana Souza"
                {...register("name")}
              />
              {errors.name ? (
                <span className="text-danger">{errors.name.message}</span>
              ) : null}
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="profile-phone">Telefone</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <input
                    id="profile-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(11) 98765-4321"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(formatPhoneInput(event.target.value))
                    }
                  />
                )}
              />
              {errors.phone ? (
                <span className="text-danger">{errors.phone.message}</span>
              ) : (
                <span className="text-muted d-block mt-1">
                  Usado para contato sobre filhos e assinatura.
                </span>
              )}
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="profile-document">CPF</label>
              <Controller
                name="document"
                control={control}
                render={({ field }) => (
                  <input
                    id="profile-document"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000.000.000-00"
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(formatCpfInput(event.target.value))
                    }
                  />
                )}
              />
              {errors.document ? (
                <span className="text-danger">{errors.document.message}</span>
              ) : (
                <span className="text-muted d-block mt-1">
                  Necessário para compras e identificação do responsável.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="widget mb-4">
          <h3 className="widget_title">Acesso à conta</h3>
          <div className="row">
            <div className="col-12 form-group">
              <label htmlFor="profile-email">E-mail</label>
              <input
                id="profile-email"
                type="email"
                value={displayEmail}
                readOnly
                disabled
              />
              <span className="text-muted d-block mt-1">
                O e-mail de login não pode ser alterado por aqui. Fale com o
                suporte se precisar trocar.
              </span>
            </div>
            <div className="col-12">
              <p className="mb-0">
                <Link href="/forgot-password">Redefinir senha</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="form-group mb-0">
          <button
            className="vs-btn"
            type="submit"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
