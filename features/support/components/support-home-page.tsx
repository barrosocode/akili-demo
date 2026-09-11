"use client";

import { SupportTopicsPanel } from "@/features/support/components/support-topics-panel";

export function SupportHomePage() {
  return (
    <div className="akili-support-page">
      <header className="akili-support-hero">
        <p className="akili-support-hero__eyebrow">Akili Educ</p>
        <h1 className="akili-support-hero__title">Central de Ajuda</h1>
        <p className="akili-support-hero__subtitle">
          Encontre respostas para suas dúvidas no Portal do Responsável.
        </p>
      </header>

      <SupportTopicsPanel showHeading />

      <p className="akili-support-page__hint text-center mt-4">
        Não encontrou o que precisa?{" "}
        <button type="button" className="btn btn-link p-0" disabled title="Em breve">
          Falar com suporte (em breve)
        </button>
      </p>
    </div>
  );
}
