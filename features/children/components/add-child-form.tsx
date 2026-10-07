"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CHILD_RELATIONSHIPS,
  createChildSchema,
  maxBirthdateInput,
  toCreateChildPayload,
  type CreateChildValues,
} from "@/features/children/schemas/create-child.schema";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { formatCpfInput } from "@/lib/masks/cpf";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { useCreatePurchaseStudentMutation } from "@/services/queries/children.mutations";

const RELATIONSHIP_LABELS: Record<(typeof CHILD_RELATIONSHIPS)[number], string> = {
  mother: "Mãe",
  father: "Pai",
  guardian: "Responsável",
  other: "Outro",
};

const FIELD_NAMES = [
  "name",
  "email",
  "preferred_name",
  "birthdate",
  "cpf",
  "relationship",
] as const;

function isFieldName(value: string): value is (typeof FIELD_NAMES)[number] {
  return (FIELD_NAMES as readonly string[]).includes(value);
}

interface AddChildFormProps {
  purchaseRef: string;
  onCreated: (name: string) => void;
  onForbidden: () => void;
  onNotFound: () => void;
  onUnauthorized: () => void;
}

export function AddChildForm({
  purchaseRef,
  onCreated,
  onForbidden,
  onNotFound,
  onUnauthorized,
}: AddChildFormProps) {
  const { refetch } = useSession();
  const mutation = useCreatePurchaseStudentMutation();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const maxBirthdate = maxBirthdateInput();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateChildValues>({
    resolver: zodResolver(createChildSchema),
    defaultValues: {
      name: "",
      email: "",
      preferred_name: "",
      birthdate: "",
      cpf: "",
      relationship: "guardian",
    },
  });

  async function onSubmit(values: CreateChildValues) {
    setPurchaseError(null);
    try {
      const created = await mutation.mutateAsync({
        ref: purchaseRef,
        payload: toCreateChildPayload(values),
      });
      refetch();
      onCreated(created.preferredName || created.name);
    } catch (error) {
      if (error instanceof BffClientError && error.status === 401) {
        onUnauthorized();
        return;
      }
      if (error instanceof BffClientError && error.status === 403) {
        onForbidden();
        return;
      }
      if (error instanceof BffClientError && error.status === 404) {
        onNotFound();
        return;
      }
      if (error instanceof BffClientError && error.status === 422 && error.errors) {
        let formLevel = error.errors.purchase ?? null;
        for (const [field, message] of Object.entries(error.errors)) {
          if (field === "purchase" || !message) continue;
          if (isFieldName(field)) {
            setError(field, { message });
          } else if (!formLevel) {
            formLevel = message;
          }
        }
        setPurchaseError(formLevel);
        return;
      }
      setPurchaseError(
        error instanceof BffClientError
          ? (error.detail ?? error.title)
          : getUserFacingApiMessage(error)
      );
    }
  }

  const fieldId = (name: string) => `${name}-${purchaseRef}`;

  return (
    <form className="form-style3" onSubmit={handleSubmit(onSubmit)} noValidate>
      {purchaseError ? (
        <div className="alert alert-danger" role="alert">
          {purchaseError}
        </div>
      ) : null}

      <div className="row">
        <div className="col-12 form-group">
          <label htmlFor={fieldId("name")}>Nome do filho</label>
          <input
            id={fieldId("name")}
            type="text"
            autoComplete="name"
            maxLength={255}
            placeholder="Ex.: Ana Silva"
            {...register("name")}
          />
          {errors.name ? (
            <span className="text-danger">{errors.name.message}</span>
          ) : null}
        </div>

        <div className="col-12 form-group">
          <label htmlFor={fieldId("email")}>E-mail do filho</label>
          <input
            id={fieldId("email")}
            type="email"
            autoComplete="email"
            maxLength={255}
            placeholder="filho@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <span className="text-danger">{errors.email.message}</span>
          ) : (
            <span className="text-muted d-block mt-1">
              O código de primeiro acesso chega neste e-mail.
            </span>
          )}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("preferred_name")}>Nome de tratamento</label>
          <input
            id={fieldId("preferred_name")}
            type="text"
            autoComplete="off"
            maxLength={255}
            placeholder="Ex.: Ana"
            {...register("preferred_name")}
          />
          {errors.preferred_name ? (
            <span className="text-danger">{errors.preferred_name.message}</span>
          ) : (
            <span className="text-muted d-block mt-1">Opcional.</span>
          )}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("birthdate")}>Data de nascimento</label>
          <input
            id={fieldId("birthdate")}
            type="date"
            autoComplete="bday"
            max={maxBirthdate}
            {...register("birthdate")}
          />
          {errors.birthdate ? (
            <span className="text-danger">{errors.birthdate.message}</span>
          ) : null}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("cpf")}>CPF</label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <input
                id={fieldId("cpf")}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) => field.onChange(formatCpfInput(event.target.value))}
              />
            )}
          />
          {errors.cpf ? (
            <span className="text-danger">{errors.cpf.message}</span>
          ) : (
            <span className="text-muted d-block mt-1">Opcional.</span>
          )}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("relationship")}>Parentesco</label>
          <select
            id={fieldId("relationship")}
            className="form-control"
            {...register("relationship")}
          >
            {CHILD_RELATIONSHIPS.map((value) => (
              <option key={value} value={value}>
                {RELATIONSHIP_LABELS[value]}
              </option>
            ))}
          </select>
          {errors.relationship ? (
            <span className="text-danger">{errors.relationship.message}</span>
          ) : null}
        </div>
      </div>

      <button className="vs-btn" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Cadastrando..." : "Cadastrar filho"}
      </button>
    </form>
  );
}
