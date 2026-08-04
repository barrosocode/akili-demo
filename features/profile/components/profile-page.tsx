"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/forms/form";
import { FormFieldWrapper } from "@/components/forms/form-field";
import { PageHeader } from "@/components/layout/page-header";
import { updateProfileSchema } from "@/features/auth/schemas/auth.schema";
import { useUpdateProfileMutation } from "@/services/queries/profile.mutations";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import type { z } from "zod";

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

export function ProfilePage() {
  const { user } = useSession();
  const updateProfile = useUpdateProfileMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: { name: user?.name ?? "" },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      toast.error(
        error instanceof BffClientError
          ? error.detail ?? error.title
          : "Não foi possível atualizar o perfil."
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Perfil"
        description="Atualize suas informações pessoais."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
          <FormFieldWrapper control={form.control} name="name" label="Nome">
            {(field) => (
              <Input
                value={String(field.value ?? "")}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
              />
            )}
          </FormFieldWrapper>

          <div className="space-y-1">
            <p className="text-sm font-medium">E-mail</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </Form>
    </>
  );
}
