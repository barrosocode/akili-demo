"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { usePurchasesQuery } from "@/services/queries/purchases.queries";
import { BffClientError } from "@/services/bff/client";
import { CreditCard } from "lucide-react";

export function PurchasesPage() {
  const { data, isLoading, error, isError } = usePurchasesQuery();

  return (
    <>
      <PageHeader
        title="Compras"
        description="Gerencie assinaturas e histórico de compras da sua família."
      />

      {isLoading ? <LoadingSkeleton rows={3} /> : null}

      {isError ? (
        <ErrorState
          description={
            error instanceof BffClientError && error.status === 501
              ? "As compras online estarão disponíveis em breve."
              : error instanceof BffClientError
                ? error.detail ?? error.title
                : "Não foi possível carregar suas compras."
          }
        />
      ) : null}

      {!isLoading && !isError && !data?.length ? (
        <EmptyState
          icon={CreditCard}
          title="Nenhuma compra encontrada"
          description="Quando você contratar um plano, ele aparecerá aqui."
        />
      ) : null}
    </>
  );
}
