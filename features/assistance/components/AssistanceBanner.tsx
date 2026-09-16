"use client";

import { useEndAssistanceMutation } from "@/services/queries/assistance.mutations";
import { useSession } from "@/providers/session-provider";
import {
  resolveAssistanceBannerContent,
  shouldRenderAssistanceBanner,
} from "@/features/assistance/assistance-chrome";

/**
 * Banner permanente do modo atendimento (somente leitura).
 * Montado em GuardianDashboardShell e AlunoDashboardShell (supervisão).
 */
export function AssistanceBanner() {
  const { user } = useSession();
  const endAssistance = useEndAssistanceMutation();
  const assistance = user?.assistance;

  if (!shouldRenderAssistanceBanner(assistance)) return null;

  const copy = resolveAssistanceBannerContent(assistance!);

  return (
    <div
      role="status"
      aria-live="polite"
      className="assistance-banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1050,
        background: "#1e3a5f",
        color: "#fff",
        padding: "12px 16px",
        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
      }}
    >
      <div className="container-style4">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 24px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 220px", minWidth: 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
              {copy.title}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.95 }}>
              {copy.targetLabel}{" "}
              <strong>{copy.targetName}</strong>
              <span aria-hidden="true"> · </span>
              <span className="d-inline-block">
                {copy.operatorLabel} <strong>{copy.operatorName}</strong>
              </span>
            </p>
          </div>
          <button
            type="button"
            className="vs-btn"
            aria-label={copy.endLabel}
            style={{
              flex: "0 0 auto",
              background: "#fff",
              color: "#1e3a5f",
              border: "none",
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 6,
              cursor: endAssistance.isPending ? "wait" : "pointer",
              opacity: endAssistance.isPending ? 0.7 : 1,
            }}
            disabled={endAssistance.isPending}
            onClick={() => endAssistance.mutate()}
          >
            {endAssistance.isPending ? copy.endingLabel : copy.endLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
