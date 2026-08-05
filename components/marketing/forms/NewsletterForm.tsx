"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/marketing/common/Button";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "@/features/marketing/schemas/newsletter";

type NewsletterFormProps = {
  /** Reservado para integração futura (API/BFF). */
  actionHref?: string;
  className?: string;
};

type FeedbackState =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

/**
 * Newsletter do marketing (SPEC-003 / MARKETING-024).
 * Stub de submit — não falha se API estiver ausente.
 */
export function NewsletterForm({
  className = "form-style5",
}: NewsletterFormProps) {
  const [feedback, setFeedback] = useState<FeedbackState>({ type: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: NewsletterFormValues) {
    setFeedback({ type: "idle" });

    // Stub até existir endpoint de newsletter (sem quebrar o fluxo).
    void values.email;
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    setFeedback({
      type: "success",
      message: "Inscrição registrada. Em breve você receberá nossas novidades.",
    });
    reset();
  }

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label className="visually-hidden" htmlFor="marketing-newsletter-email">
          Seu e-mail
        </label>
        <input
          id="marketing-newsletter-email"
          type="email"
          placeholder="Seu E-mail"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={
            errors.email
              ? "marketing-newsletter-email-error"
              : feedback.type !== "idle"
                ? "marketing-newsletter-feedback"
                : undefined
          }
          {...register("email")}
        />
        <Button type="submit" variant="form5" disabled={isSubmitting}>
          {isSubmitting ? "Inscrevendo…" : "Inscrever"}
        </Button>
      </div>

      {errors.email ? (
        <p
          id="marketing-newsletter-email-error"
          role="alert"
          className="text-danger"
        >
          {errors.email.message}
        </p>
      ) : null}

      {feedback.type === "success" ? (
        <p
          id="marketing-newsletter-feedback"
          role="status"
          className="text-success"
        >
          {feedback.message}
        </p>
      ) : null}

      {feedback.type === "error" ? (
        <p
          id="marketing-newsletter-feedback"
          role="alert"
          className="text-danger"
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
