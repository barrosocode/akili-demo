import Link from "next/link";

type ChildDetailPageProps = {
  params: Promise<{ ref: string }>;
};

/**
 * Detalhe do filho — Kiddino (PORTAL-008).
 * Progresso detalhado via API em follow-up; sem expor ref na UI.
 */
export default async function ChildDetailPage({ params }: ChildDetailPageProps) {
  await params;

  return (
    <div className="blog-content">
      <h2 className="blog-title">Detalhes do aluno</h2>
      <p>
        O acompanhamento detalhado de progresso estará disponível em breve nesta
        tela.
      </p>
      <p>
        <Link href="/" className="vs-btn">
          Voltar aos filhos
        </Link>
      </p>
    </div>
  );
}
