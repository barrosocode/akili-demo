import type { SessionAssistance } from "../../types/session.ts";

/**
 * Shells that mount AssistanceBanner once each.
 * Guardian and Aluno route trees never nest — so the banner appears at most once.
 */
export const ASSISTANCE_BANNER_SHELL_MOUNT_POINTS = [
  "GuardianDashboardShell",
  "AlunoDashboardShell",
] as const;

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
