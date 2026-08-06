"use client";

import Link from "next/link";

import { useChildrenQuery } from "@/services/queries/children.queries";
import { useSession } from "@/providers/session-provider";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";
import { ChildHomeProgressCard } from "@/features/children/components/child-home-progress-card";

/**
 * Home dos filhos — visual Kiddino (PORTAL-007) + plano e resumo de progresso.
 */
export function ChildrenHome() {
  const { user, activeChildRef, setActiveChildRef } = useSession();
  const { data, isLoading, error } = useChildrenQuery();
  const canAddChildren = user?.capabilities.canAddChildren ?? false;
  const children = data ?? user?.children ?? [];
  const subscription = user?.subscription ?? null;

  return (
    <div className="blog-content">
      <div className="blog-meta">
        <h2 className="blog-title">Meus filhos</h2>
      </div>
      <p>
        Acompanhe o progresso e as informações dos alunos vinculados à sua
        conta.
      </p>

      {subscription ? (
        <div className="widget mb-4">
          <h3 className="widget_title">Seu plano</h3>
          <p className="mb-1">
            <strong>{subscription.planName}</strong>
            {subscription.status === "active" ? " · Ativo" : ` · ${subscription.status}`}
          </p>
          {subscription.description ? <p>{subscription.description}</p> : null}
          <p className="mb-2">
            Filhos: {subscription.limits.studentsUsed}
            {subscription.limits.maxStudents != null
              ? ` de ${subscription.limits.maxStudents}`
              : " (sem limite global)"}
          </p>
          {subscription.upgradeTargets.length ? (
            <p className="mb-0">
              <Link href="/purchases" className="vs-btn">
                Fazer upgrade
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {canAddChildren ? (
        <p className="mb-4">
          <Link href="/children/new" className="vs-btn">
            Adicionar filho
          </Link>
        </p>
      ) : null}

      {isLoading && !children.length ? <p>Carregando...</p> : null}

      {error ? (
        <p style={{ color: "red" }}>
          {error instanceof BffClientError
            ? (error.detail ?? error.title)
            : getUserFacingApiMessage(error)}
        </p>
      ) : null}

      {!isLoading && !error && !children.length ? (
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

      {children.length > 0 ? (
        <div className="row">
          {children.map((child) => {
            const isActive = child.ref === activeChildRef;
            return (
              <div key={child.ref} className="col-md-6 mb-4">
                <div
                  className="widget portal-child-card h-100"
                  style={
                    isActive
                      ? { outline: "2px solid #2d6cdf", outlineOffset: 2 }
                      : undefined
                  }
                >
                  <h3 className="widget_title">
                    <Link href={`/children/${child.ref}`}>{child.name}</Link>
                  </h3>
                  {child.classroomName ? <p>{child.classroomName}</p> : null}
                  {child.gradeLabel ? <p>{child.gradeLabel}</p> : null}
                  {child.schoolName ? <p>{child.schoolName}</p> : null}

                  {child.canViewProgress && child.accessible ? (
                    <ChildHomeProgressCard childRef={child.ref} />
                  ) : (
                    <p className="small text-muted">
                      Progresso indisponível para este vínculo.
                    </p>
                  )}

                  <div className="d-flex gap-2 flex-wrap mt-3 align-items-center">
                    <Link href={`/children/${child.ref}`} className="vs-btn">
                      Ver detalhes
                    </Link>
                    {child.canViewProgress && child.accessible ? (
                      <Link
                        href={`/aluno/supervisao/${child.ref}`}
                        className="vs-btn style3"
                      >
                        Acessar Ambiente do Aluno
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="vs-btn style3"
                      onClick={() => setActiveChildRef(child.ref)}
                      disabled={isActive}
                      aria-pressed={isActive}
                    >
                      {isActive ? "Ativo" : "Selecionar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
