"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChildRegistrationConsents } from "@/features/children/components/child-registration-consents";
import {
  CHILD_RELATIONSHIPS,
  createChildSchema,
  maxBirthdateInput,
  toCreateChildPayload,
  type CreateChildConsentInput,
  type CreateChildValues,
} from "@/features/children/schemas/create-child.schema";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { formatCpfInput } from "@/lib/masks/cpf";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import type { ChildRegistrationConsent } from "@/services/bff/consents.bff";
import { useCreatePurchaseStudentMutation } from "@/services/queries/children.mutations";

const RELATIONSHIP_LABELS: Record<(typeof CHILD_RELATIONSHIPS)[number], string> = {
  mother: "Mãe",
  father: "Pai",
  guardian: "Responsável",
  other: "Outro",
};

const FIELD_NAMES = [
  "name",
  "login",
  "password",
  "password_confirmation",
  "preferred_name",
  "birthdate",
  "cpf",
  "relationship",
] as const;

function isFieldName(value: string): value is (typeof FIELD_NAMES)[number] {
  return (FIELD_NAMES as readonly string[]).includes(value);
}

type ConsentsStatus = "loading" | "error" | "empty" | "ready";

interface AddChildFormProps {
  purchaseRef: string;
  documents: ChildRegistrationConsent[];
  consentsStatus: ConsentsStatus;
  consentsError: string | null;
  consentsResetKey: number;
  onRetryConsents: () => void;
  onConsentsRejected: () => void;
  onCreated: (child: { name: string; login: string | null }) => void;
  onForbidden: () => void;
  onNotFound: () => void;
  onUnauthorized: () => void;
}

export function AddChildForm({
  purchaseRef,
  documents,
  consentsStatus,
  consentsError,
  consentsResetKey,
  onRetryConsents,
  onConsentsRejected,
  onCreated,
  onForbidden,
  onNotFound,
  onUnauthorized,
}: AddChildFormProps) {
  const { refetch } = useSession();
  const mutation = useCreatePurchaseStudentMutation();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [readRefs, setReadRefs] = useState<ReadonlySet<string>>(() => new Set());
  const [acceptedRefs, setAcceptedRefs] = useState<ReadonlySet<string>>(() => new Set());
  const documentsKey = documents.map((document) => document.ref).join("|");
  const consentIdentity = `${documentsKey}:${consentsResetKey}`;
  const [trackedConsentIdentity, setTrackedConsentIdentity] = useState(consentIdentity);
  if (trackedConsentIdentity !== consentIdentity) {
    setTrackedConsentIdentity(consentIdentity);
    setReadRefs(new Set());
    setAcceptedRefs(new Set());
  }
  const maxBirthdate = maxBirthdateInput();
  const allAccepted =
    consentsStatus === "ready" &&
    documents.length > 0 &&
    documents.every((document) => acceptedRefs.has(document.ref));

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
      login: "",
      password: "",
      password_confirmation: "",
      preferred_name: "",
      birthdate: "",
      cpf: "",
      relationship: "guardian",
    },
  });

  function clearConsents() {
    setReadRefs(new Set());
    setAcceptedRefs(new Set());
  }

  async function onSubmit(values: CreateChildValues) {
    setPurchaseError(null);
    setConsentError(null);
    if (!allAccepted) return;

    const consents: CreateChildConsentInput[] = documents.map((document) => ({
      documentRef: document.ref,
      accepted: true,
    }));

    try {
      const created = await mutation.mutateAsync({
        ref: purchaseRef,
        payload: toCreateChildPayload(values, consents),
      });
      refetch();
      onCreated({
        name: created.preferredName || created.name,
        login: created.login,
      });
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
        const consentsMessage = error.errors.consents ?? null;
        if (consentsMessage) {
          setConsentError(consentsMessage);
          clearConsents();
          onConsentsRejected();
        }
        let formLevel = error.errors.purchase ?? null;
        for (const [field, message] of Object.entries(error.errors)) {
          if (field === "purchase" || field === "consents" || !message) continue;
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
          <label htmlFor={fieldId("login")}>Usuário do filho</label>
          <input
            id={fieldId("login")}
            type="text"
            autoComplete="username"
            maxLength={32}
            placeholder="Ex.: ana.silva"
            {...register("login")}
          />
          {errors.login ? (
            <span className="text-danger">{errors.login.message}</span>
          ) : (
            <span className="text-muted d-block mt-1">
              O filho entra na área do aluno com esse usuário e a senha abaixo, sem e-mail.
            </span>
          )}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("password")}>Senha</label>
          <input
            id={fieldId("password")}
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password ? (
            <span className="text-danger">{errors.password.message}</span>
          ) : (
            <span className="text-muted d-block mt-1">Mínimo de 8 caracteres.</span>
          )}
        </div>

        <div className="col-md-6 form-group">
          <label htmlFor={fieldId("password_confirmation")}>Confirmar senha</label>
          <input
            id={fieldId("password_confirmation")}
            type="password"
            autoComplete="new-password"
            {...register("password_confirmation")}
          />
          {errors.password_confirmation ? (
            <span className="text-danger">{errors.password_confirmation.message}</span>
          ) : null}
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

      <ChildRegistrationConsents
        purchaseRef={purchaseRef}
        documents={documents}
        status={consentsStatus}
        errorMessage={consentsError}
        consentError={consentError}
        disabled={mutation.isPending}
        readRefs={readRefs}
        acceptedRefs={acceptedRefs}
        onRetry={onRetryConsents}
        onMarkRead={(ref) =>
          setReadRefs((current) => {
            if (current.has(ref)) return current;
            const next = new Set(current);
            next.add(ref);
            return next;
          })
        }
        onToggleAccepted={(ref, accepted) =>
          setAcceptedRefs((current) => {
            const next = new Set(current);
            if (accepted) next.add(ref);
            else next.delete(ref);
            return next;
          })
        }
      />

      {consentsStatus === "ready" && !allAccepted ? (
        <p className="text-muted">Aceite os termos para cadastrar o filho.</p>
      ) : null}

      <button className="vs-btn" type="submit" disabled={mutation.isPending || !allAccepted}>
        {mutation.isPending ? "Cadastrando..." : "Cadastrar filho"}
      </button>
    </form>
  );
}
