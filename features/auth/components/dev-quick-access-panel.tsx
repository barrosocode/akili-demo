"use client";

import type { DevLoginProfile } from "@/lib/auth/dev-login-profiles";

interface DevQuickAccessPanelProps {
  profiles: readonly DevLoginProfile[];
  disabled?: boolean;
  onSelect: (profile: DevLoginProfile) => void;
}

export function DevQuickAccessPanel({
  profiles,
  disabled = false,
  onSelect,
}: DevQuickAccessPanelProps) {
  return (
    <section
      aria-labelledby="dev-quick-access-title"
      className="mt-4 p-3"
      style={{ border: "1px dashed #cfcfcf", borderRadius: "12px" }}
    >
      <p
        className="mb-1 text-uppercase"
        style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}
      >
        Somente testes
      </p>
      <h2 id="dev-quick-access-title" className="h6 mb-1">
        Acesso rápido para testes
      </h2>
      <p className="mb-3">
        Os campos serão preenchidos. Clique em Entrar para acessar.
      </p>
      <div className="row g-2">
        {profiles.map((profile) => (
          <div className="col-12 col-sm-6" key={profile.id}>
            <button
              type="button"
              className="vs-btn style3 w-100"
              disabled={disabled}
              onClick={() => onSelect(profile)}
            >
              {profile.label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
