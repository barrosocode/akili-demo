import Link from "next/link";

/**
 * Relatórios do responsável — MVP Kiddino (PORTAL-011).
 */
export default function RelatoriosPage() {
  return (
    <div className="blog-content">
      <h2 className="blog-title">Relatórios</h2>
      <p>
        Os relatórios de progresso dos seus filhos aparecerão aqui. Enquanto a
        API não estiver disponível, use o acompanhamento na lista de filhos.
      </p>
      <div className="accordion accordion-style1 v2" id="relatorios-mvp">
        <div className="accordion-item active">
          <h3 className="accordion-header">
            <button type="button" className="accordion-button" disabled>
              Relatórios mensais
            </button>
          </h3>
          <div className="accordion-collapse collapse show">
            <div className="accordion-body">
              <p className="mb-0">
                Em breve você verá resumos por período e recomendações de estudo.
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4">
        <Link href="/" className="vs-btn">
          Voltar
        </Link>
      </p>
    </div>
  );
}
