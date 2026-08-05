"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { updateProfileSchema } from "@/features/auth/schemas/auth.schema";
import { useUpdateProfileMutation } from "@/services/queries/profile.mutations";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { useState } from "react";

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

/**
 * Perfil do responsável — Kiddino (PORTAL-009).
 */
export function ProfilePage() {
  const { user } = useSession();
  const updateProfile = useUpdateProfileMutation();
  const [success, setSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: user?.name ?? "" },
  });

  async function onSubmit(values: ProfileFormValues) {
    setSuccess(null);
    setErrorMsg(null);
    try {
      await updateProfile.mutateAsync(values);
      setSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      setErrorMsg(
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : "Não foi possível atualizar o perfil.",
      );
    }
  }

  return (
    <div className="blog-content">
      <h2 className="blog-title">Meus dados</h2>
      <p>Atualize suas informações pessoais.</p>
      {success ? (
        <p style={{ color: "green" }}>
          <strong>{success}</strong>
        </p>
      ) : null}
      {errorMsg ? (
        <p style={{ color: "red" }}>
          <strong>{errorMsg}</strong>
        </p>
      ) : null}
      <form className="form-style3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="row">
          <div className="col-md-8 form-group">
            <label htmlFor="profile-name">Nome</label>
            <input id="profile-name" type="text" {...register("name")} />
            {errors.name ? (
              <span className="text-danger">{errors.name.message}</span>
            ) : null}
          </div>
          <div className="col-md-8 form-group">
            <label>E-mail</label>
            <p>{user?.email}</p>
          </div>
          <div className="col-auto form-group">
            <button
              className="vs-btn"
              type="submit"
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
