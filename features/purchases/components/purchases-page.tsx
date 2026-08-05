"use client";

import Link from "next/link";

import { usePurchasesQuery } from "@/services/queries/purchases.queries";
import { BffClientError } from "@/services/bff/client";

/**
 * Compras — Kiddino (PORTAL-010).
 */
export function PurchasesPage() {
  const { data, isLoading, error, isError } = usePurchasesQuery();

  return (
    <div className="blog-content">
      <h2 className="blog-title">Compras</h2>
      <p>Gerencie assinaturas e histórico de compras da sua família.</p>
      <p>
        <Link href="/checkout" className="vs-btn">
          Ir para o checkout
        </Link>
      </p>

      {isLoading ? <p>Carregando...</p> : null}

      {isError ? (
        <div className="alert alert-warning" role="status">
          {error instanceof BffClientError && error.status === 501
            ? "As compras online estarão disponíveis em breve."
            : error instanceof BffClientError
              ? (error.detail ?? error.title)
              : "Não foi possível carregar suas compras."}
        </div>
      ) : null}

      {!isLoading && !isError && !data?.length ? (
        <div className="alert alert-info" role="status">
          Nenhuma compra encontrada. Quando você contratar um plano, ele
          aparecerá aqui.
        </div>
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <ul className="list-unstyled">
          {data.map((item, index) => {
            const label =
              typeof item === "object" &&
              item !== null &&
              "label" in item &&
              typeof (item as { label: unknown }).label === "string"
                ? (item as { label: string }).label
                : typeof item === "object" &&
                    item !== null &&
                    "name" in item &&
                    typeof (item as { name: unknown }).name === "string"
                  ? (item as { name: string }).name
                  : `Compra ${index + 1}`;
            return <li key={label}>{label}</li>;
          })}
        </ul>
      ) : null}
    </div>
  );
}
