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

      {!isLoading && !isError && !data?.purchases.length ? (
        <div className="alert alert-info" role="status">
          Nenhuma compra encontrada. Quando você contratar um plano, ele
          aparecerá aqui.
        </div>
      ) : null}

      {!isLoading && !isError && data && data.purchases.length > 0 ? (
        <ul className="list-unstyled">
          {data.purchases.map((item) => (
            <li key={item.ref}>{item.packageName}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
