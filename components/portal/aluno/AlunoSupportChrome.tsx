import type { ReactNode } from "react";

import { TawkProvider } from "@/features/support/tawk";
import { readTawkPublicConfig } from "@/features/support/tawk/read-tawk-public-config";

type AlunoSupportChromeProps = {
  children: ReactNode;
};

/**
 * Injeta Tawk no shell autenticado do aluno e na supervisão.
 * Não usar em `/aluno/entrar`.
 */
export function AlunoSupportChrome({ children }: AlunoSupportChromeProps) {
  const tawkConfig = readTawkPublicConfig();

  return <TawkProvider config={tawkConfig}>{children}</TawkProvider>;
}
