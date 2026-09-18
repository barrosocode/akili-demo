"use client";

import Link from "next/link";
import {
  resolveSupportActions,
  type ResolvedSupportAction,
} from "@/features/support/lib/map-route-target";
import type { SupportFaqAction } from "@/types/domain/support-faq";

type SupportFaqActionsProps = {
  actions: SupportFaqAction[];
};

function ActionLink({ action }: { action: ResolvedSupportAction }) {
  if (action.kind === "external") {
    return (
      <a
        href={action.href}
        className="vs-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className="vs-btn">
      {action.label}
    </Link>
  );
}

export function SupportFaqActions({ actions }: SupportFaqActionsProps) {
  const resolved = resolveSupportActions(actions);
  if (resolved.length === 0) return null;

  return (
    <section className="akili-support-actions" aria-label="Ações">
      <h2 className="akili-support-actions__title">Ações</h2>
      <div className="akili-support-actions__list">
        {resolved.map((action) => (
          <ActionLink key={`${action.kind}-${action.href}-${action.label}`} action={action} />
        ))}
      </div>
    </section>
  );
}
