"use client";

import Link from "next/link";

import { useChildrenQuery } from "@/services/queries/children.queries";
import { useSession } from "@/providers/session-provider";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";

/**
 * Home dos filhos — visual Kiddino (PORTAL-007).
 */
export function ChildrenHome() {
  const { user } = useSession();
  const { data, isLoading, error } = useChildrenQuery();
  const canAddChildren = user?.capabilities.canAddChildren ?? false;

  return (
    <div className="blog-content">
      <div className="blog-meta">
        <h2 className="blog-title">Meus filhos</h2>
      </div>
      <p>
        Acompanhe o progresso e as informações dos alunos vinculados à sua
        conta.
      </p>

      {canAddChildren ? (
        <p className="mb-4">
          <Link href="/children/new" className="vs-btn">
            Adicionar filho
          </Link>
        </p>
      ) : null}

      {isLoading ? <p>Carregando...</p> : null}

      {error ? (
        <p style={{ color: "red" }}>
          {error instanceof BffClientError
            ? (error.detail ?? error.title)
            : getUserFacingApiMessage(error)}
        </p>
      ) : null}

      {!isLoading && !error && !data?.length ? (
        <div className="alert alert-info" role="status">
          <strong>
            {canAddChildren
              ? "Nenhum filho cadastrado"
              : "Sua escola ainda não vinculou alunos"}
          </strong>
          <p className="mb-0">
            {canAddChildren
              ? "Adicione o primeiro filho para começar a acompanhar o progresso."
              : "Entre em contato com a escola para solicitar o vínculo do aluno à sua conta."}
          </p>
        </div>
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <div className="row">
          {data.map((child) => (
            <div key={child.ref} className="col-md-6 mb-4">
              <div className="widget">
                <h3 className="widget_title">
                  <Link href={`/children/${child.ref}`}>{child.name}</Link>
                </h3>
                {child.gradeLabel ? <p>{child.gradeLabel}</p> : null}
                <Link href={`/children/${child.ref}`} className="vs-btn">
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
