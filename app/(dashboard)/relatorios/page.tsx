"use client";

import Link from "next/link";

import { useSession } from "@/providers/session-provider";
import { useChildrenQuery } from "@/services/queries/children.queries";

/**
 * Relatórios — aponta para o detalhe do filho (dados da API).
 */
export default function RelatoriosPage() {
  const { user, activeChildRef } = useSession();
  const { data, isLoading } = useChildrenQuery();
  const children = data ?? user?.children ?? [];
  const active =
    children.find((child) => child.ref === activeChildRef) ?? children[0];

  return (
    <div className="blog-content">
      <h2 className="blog-title">Relatórios</h2>
      <p>
        Os relatórios pedagógicos ficam no acompanhamento de cada filho. Escolha
        um aluno para ver o período, as recomendações e o desempenho.
      </p>

      {isLoading && !children.length ? <p>Carregando...</p> : null}

      {!isLoading && !children.length ? (
        <div className="alert alert-info" role="status">
          Nenhum filho vinculado ainda.
        </div>
      ) : null}

      {children.length ? (
        <ul className="mb-4">
          {children.map((child) => (
            <li key={child.ref}>
              <Link href={`/children/${child.ref}`}>{child.name}</Link>
              {child.gradeLabel ? ` · ${child.gradeLabel}` : null}
            </li>
          ))}
        </ul>
      ) : null}

      {active ? (
        <p>
          <Link href={`/children/${active.ref}`} className="vs-btn">
            Ver relatório de {active.name}
          </Link>
        </p>
      ) : (
        <p>
          <Link href="/children" className="vs-btn">
            Voltar
          </Link>
        </p>
      )}
    </div>
  );
}
