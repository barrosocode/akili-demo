import type { SessionAssistance } from "../../types/session";

/**
 * Shells that mount AssistanceBanner once each.
 * Guardian and Aluno route trees never nest — so the banner appears at most once.
 */
export const ASSISTANCE_BANNER_SHELL_MOUNT_POINTS = [
  "GuardianDashboardShell",
  "AlunoDashboardShell",
] as const;

/** Public BEM classes used by AssistanceBanner (asserted in tests). */
export const ASSISTANCE_BANNER_CSS_CLASSES = [
  "assistance-banner",
  "assistance-banner__title",
  "assistance-banner__meta",
  "assistance-banner__end",
] as const;

/** html[data-assistance-banner="true"] — offsets theme sticky header below the strip. */
export const ASSISTANCE_BANNER_HTML_ATTR = "data-assistance-banner";

/** CSS custom property written on <html> with measured strip height. */
export const ASSISTANCE_BANNER_HEIGHT_VAR = "--assistance-banner-height";

export function shouldRenderAssistanceBanner(
  assistance: SessionAssistance | null | undefined
): boolean {
  return Boolean(assistance?.active);
}

export type AssistanceBannerContent = {
  title: string;
  targetLabel: string;
  targetName: string;
  operatorLabel: string;
  operatorName: string;
  endLabel: string;
  endingLabel: string;
};

export function resolveAssistanceBannerContent(
  assistance: Pick<SessionAssistance, "target" | "operator">
): AssistanceBannerContent {
  return {
    title: "Modo de atendimento — somente leitura",
    targetLabel: "Visualizando o portal de:",
    targetName: assistance.target.name,
    operatorLabel: "Atendente:",
    operatorName: assistance.operator.name,
    endLabel: "Encerrar acesso",
    endingLabel: "Encerrando…",
  };
}
