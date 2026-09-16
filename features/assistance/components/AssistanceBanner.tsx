"use client";

import { useEffect, useRef } from "react";

import { useEndAssistanceMutation } from "@/services/queries/assistance.mutations";
import { useSession } from "@/providers/session-provider";
import {
  ASSISTANCE_BANNER_HEIGHT_VAR,
  ASSISTANCE_BANNER_HTML_ATTR,
  resolveAssistanceBannerContent,
  shouldRenderAssistanceBanner,
} from "@/features/assistance/assistance-chrome";

/**
 * Banner permanente do modo atendimento (somente leitura).
 * Sticky no topo (acima do header); mede a altura para o header sticky
 * do tema encaixar abaixo ao rolar.
 */
export function AssistanceBanner() {
  const { user } = useSession();
  const endAssistance = useEndAssistanceMutation();
  const assistance = user?.assistance;
  const bannerRef = useRef<HTMLDivElement>(null);

  const visible = shouldRenderAssistanceBanner(assistance);

  useEffect(() => {
    if (!visible) return;

    const root = document.documentElement;
    const el = bannerRef.current;
    if (!el) return;

    const syncHeight = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      root.setAttribute(ASSISTANCE_BANNER_HTML_ATTR, "true");
      root.style.setProperty(ASSISTANCE_BANNER_HEIGHT_VAR, `${height}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);

    return () => {
      observer.disconnect();
      root.removeAttribute(ASSISTANCE_BANNER_HTML_ATTR);
      root.style.removeProperty(ASSISTANCE_BANNER_HEIGHT_VAR);
    };
  }, [visible]);

  if (!visible) return null;

  const copy = resolveAssistanceBannerContent(assistance!);

  return (
    <div
      ref={bannerRef}
      role="status"
      aria-live="polite"
      className="assistance-banner"
      data-assistance-active="true"
    >
      <div className="assistance-banner__inner container-style4">
        <div className="assistance-banner__content">
          <p className="assistance-banner__title">{copy.title}</p>
          <p className="assistance-banner__meta">
            <span className="assistance-banner__meta-label">
              {copy.targetLabel}{" "}
            </span>
            <strong className="assistance-banner__meta-value">
              {copy.targetName}
            </strong>
            <span className="assistance-banner__sep" aria-hidden="true">
              {" "}
              ·{" "}
            </span>
            <span className="assistance-banner__meta-label">
              {copy.operatorLabel}{" "}
            </span>
            <strong className="assistance-banner__meta-value">
              {copy.operatorName}
            </strong>
          </p>
        </div>
        <button
          type="button"
          className="assistance-banner__end vs-btn"
          aria-label={copy.endLabel}
          disabled={endAssistance.isPending}
          onClick={() => endAssistance.mutate()}
        >
          {endAssistance.isPending ? copy.endingLabel : copy.endLabel}
        </button>
      </div>
    </div>
  );
}
