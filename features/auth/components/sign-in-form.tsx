"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/forms/form";
import { FormFieldWrapper } from "@/components/forms/form-field";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { useLoginMutation } from "@/services/queries/auth.mutations";
import { BffClientError } from "@/services/bff/client";
import type { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export function SignInForm() {
  const router = useRouter();
  const login = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login.mutateAsync(values);
      toast.success("Login realizado com sucesso");
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof BffClientError
          ? error.detail ?? error.title
          : "Não foi possível entrar. Verifique seus dados.";
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldWrapper control={form.control} name="email" label="E-mail">
          {(field) => (
            <Input
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={String(field.value ?? "")}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
            />
          )}
        </FormFieldWrapper>

        <FormFieldWrapper control={form.control} name="password" label="Senha">
          {(field) => (
            <Input
              type="password"
              autoComplete="current-password"
              value={String(field.value ?? "")}
              onChange={(event) => field.onChange(event.target.value)}
              onBlur={field.onBlur}
            />
          )}
        </FormFieldWrapper>

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
