"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AddChildForm } from "@/features/children/components/add-child-form";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { formatDate } from "@/lib/utils/format";
import { BffClientError } from "@/services/bff/client";
import { usePurchasesQuery } from "@/services/queries/purchases.queries";
import type { GuardianPurchase } from "@/types/domain/guardian-purchase";

export function AddChildPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [createdNames, setCreatedNames] = useState<Record<string, string>>({});
  const [closed, setClosed] = useState<Record<string, string>>({});
  const [forbidden, setForbidden] = useState(false);
  const { data, isLoading, isError, error, refetch } = usePurchasesQuery(page);

  useEffect(() => {
    if (!(error instanceof BffClientError)) return;
    if (error.status === 401) {
      router.replace("/signin");
      return;
    }
    if (error.status === 403) setForbidden(true);
  }, [error, router]);

  const purchases = data?.purchases ?? [];
  const pagination = data?.pagination;
  const unauthorized = error instanceof BffClientError && error.status === 401;

  function childName(purchase: GuardianPurchase): string | null {
    return purchase.student?.name || createdNames[purchase.ref] || null;
  }

  const everyChildLinked =
    purchases.length > 0 &&
    (pagination?.totalPages ?? 1) <= 1 &&
    purchases.every((purchase) => Boolean(childName(purchase)));

  return (
    <div className="blog-content">
      <div className="blog-meta">
        <h2 className="blog-title">Adicionar filho</h2>
      </div>
      <p>
        Cada plano pago permite cadastrar um filho. Preencha os dados no plano
        que ainda está sem aluno.
      </p>

      {unauthorized ? <p role="status">Redirecionando para o login...</p> : null}

      {isLoading && !purchases.length ? <p role="status">Carregando seus planos...</p> : null}

      {forbidden ? (
        <div className="alert alert-warning" role="status">
          Você não tem permissão para cadastrar um filho.
        </div>
      ) : null}

      {isError && !unauthorized && !forbidden ? (
        <div className="alert alert-danger" role="alert">
          <strong>Não foi possível carregar seus planos.</strong>
          <p className="mb-2">
            {error instanceof BffClientError
              ? (error.detail ?? error.title)
              : getUserFacingApiMessage(error)}
          </p>
          <button type="button" className="vs-btn" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && !purchases.length ? (
        <div className="alert alert-info" role="status">
          <strong>Nenhum plano disponível</strong>
          <p className="mb-2">
            Contrate um plano para cadastrar um filho na sua conta.
          </p>
          <Link href="/checkout" className="vs-btn">
            Ver planos
          </Link>
        </div>
      ) : null}

      {!isLoading && !isError && everyChildLinked ? (
        <div className="alert alert-info" role="status">
          <strong>Cada plano já tem um filho cadastrado.</strong>
          <p className="mb-2">
            Para incluir outro filho, contrate um novo plano.
          </p>
          <Link href="/children" className="vs-btn">
            Voltar aos filhos
          </Link>
        </div>
      ) : null}

      {purchases.length > 0 ? (
        <div className="row">
          {purchases.map((purchase) => {
            const name = childName(purchase);
            const showForm =
              !forbidden &&
              !closed[purchase.ref] &&
              !name &&
              purchase.canAddChild;

            return (
              <div key={purchase.ref} className="col-12 mb-4">
                <div className="widget portal-child-card h-100">
                  <h3 className="widget_title">{purchase.packageName}</h3>
                  {purchase.amountLabel ? <p className="mb-1">{purchase.amountLabel}</p> : null}
                  <p className="mb-1">Situação: {purchase.statusLabel}</p>
                  {purchase.paidAt ? (
                    <p className="mb-3">Pago em {formatDate(purchase.paidAt)}</p>
                  ) : null}

                  {closed[purchase.ref] ? (
                    <div className="alert alert-warning mb-0" role="status">
                      {closed[purchase.ref]}
                    </div>
                  ) : null}

                  {name ? (
                    <div>
                      <p className="mb-2">
                        Filho cadastrado: <strong>{name}</strong>
                      </p>
                      {purchase.student?.ref ? (
                        <Link href={`/children/${purchase.student.ref}`} className="vs-btn">
                          Ver detalhes
                        </Link>
                      ) : null}
                    </div>
                  ) : null}

                  {showForm ? (
                    <AddChildForm
                      purchaseRef={purchase.ref}
                      onCreated={(createdName) =>
                        setCreatedNames((current) => ({
                          ...current,
                          [purchase.ref]: createdName,
                        }))
                      }
                      onForbidden={() => setForbidden(true)}
                      onNotFound={() =>
                        setClosed((current) => ({
                          ...current,
                          [purchase.ref]: "Não encontramos esta compra.",
                        }))
                      }
                      onUnauthorized={() => router.replace("/signin")}
                    />
                  ) : null}

                  {!name && !showForm && !closed[purchase.ref] && purchase.unavailableReason ? (
                    <p className="mb-0">{purchase.unavailableReason}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? (
        <div className="d-flex gap-2 flex-wrap align-items-center mb-4">
          <button
            type="button"
            className="vs-btn style3"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            type="button"
            className="vs-btn style3"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </button>
        </div>
      ) : null}

      <p className="mb-0">
        <Link href="/children" className="vs-btn style3">
          Voltar aos filhos
        </Link>
      </p>
    </div>
  );
}
