"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { useChildrenQuery } from "@/services/queries/children.queries";
import { useSession } from "@/providers/session-provider";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import { Baby } from "lucide-react";

export function ChildrenHome() {
  const { user } = useSession();
  const { data, isLoading, error } = useChildrenQuery();

  const canAddChildren = user?.capabilities.canAddChildren ?? false;

  return (
    <>
      <PageHeader
        title="Meus filhos"
        description="Acompanhe o progresso e as informações dos alunos vinculados à sua conta."
        actions={
          canAddChildren ? (
            <Link href="/children/new" className={cn(buttonVariants())}>
              <Plus className="size-4" aria-hidden />
              Adicionar filho
            </Link>
          ) : null
        }
      />

      {isLoading ? <LoadingSkeleton rows={4} /> : null}

      {error ? (
        <ErrorState
          description={
            error instanceof BffClientError
              ? error.detail ?? error.title
              : getUserFacingApiMessage(error)
          }
        />
      ) : null}

      {!isLoading && !error && !data?.length ? (
        <EmptyState
          icon={Baby}
          title={
            canAddChildren
              ? "Nenhum filho cadastrado"
              : "Sua escola ainda não vinculou alunos"
          }
          description={
            canAddChildren
              ? "Adicione o primeiro filho para começar a acompanhar o progresso."
              : "Entre em contato com a escola para solicitar o vínculo do aluno à sua conta."
          }
          actionLabel={canAddChildren ? "Adicionar filho" : undefined}
          onAction={
            canAddChildren
              ? () => {
                  window.location.href = "/children/new";
                }
              : undefined
          }
        />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((child) => (
            <Card key={child.ref}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={child.avatarUrl ?? undefined} alt={child.name} />
                  <AvatarFallback>{child.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{child.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {child.schoolName ?? "Família Akili"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {child.gradeLabel ?? "Turma não informada"}
                </div>
                <Link
                  href={`/children/${child.ref}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Ver detalhes
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </>
  );
}
