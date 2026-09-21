"use client";

import { SupportTalkToAgentButton } from "@/features/support/components/support-talk-to-agent-button";
import { SupportTopicsPanel } from "@/features/support/components/support-topics-panel";

export function SupportHomePage() {
  return (
    <div className="akili-support-page">
      <header className="akili-support-hero">
        <p className="akili-support-hero__eyebrow">Akili Educ</p>
        <h1 className="akili-support-hero__title">Central de Ajuda</h1>
        <p className="akili-support-hero__subtitle">
          Encontre respostas para suas dúvidas.
        </p>
      </header>

      <SupportTopicsPanel showHeading />

      <p className="akili-support-page__hint text-center mt-4">
        Não encontrou o que precisa?{" "}
        <SupportTalkToAgentButton className="btn btn-link p-0" />
      </p>
    </div>
  );
}
