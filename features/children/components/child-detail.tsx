"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ChildReports } from "@/features/children/components/child-reports";
import { useSession } from "@/providers/session-provider";
import { useChildrenQuery } from "@/services/queries/children.queries";

type ChildDetailProps = {
  childRef: string;
};

/**
 * Resolve o filho pelo ref opaco e exibe relatórios mockados.
 */
export function ChildDetail({ childRef }: ChildDetailProps) {
  const { user, setActiveChildRef } = useSession();
  const { data, isLoading, error } = useChildrenQuery();
  const children = data ?? user?.children ?? [];
  const child = children.find((item) => item.ref === childRef);

  useEffect(() => {
    if (child?.ref) {
      setActiveChildRef(child.ref);
    }
  }, [child?.ref, setActiveChildRef]);

  if (isLoading && !child) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  if (error && !child) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Relatórios</h2>
        <p>Não foi possível carregar os dados deste aluno.</p>
        <p>
          <Link href="/" className="vs-btn">
            Voltar aos filhos
          </Link>
        </p>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Relatórios</h2>
        <p>Filho não encontrado na sua conta.</p>
        <p>
          <Link href="/" className="vs-btn">
            Voltar aos filhos
          </Link>
        </p>
      </div>
    );
  }

  return <ChildReports childName={child.name} />;
}
