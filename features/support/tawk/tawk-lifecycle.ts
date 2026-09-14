import { logoutTawk } from "@/features/support/tawk/tawk.service";

type TawkSessionReset = () => Promise<void>;

let boundReset: TawkSessionReset | null = null;

/**
 * O TawkProvider registra o reset do controller (estado + logout widget).
 * Logout/demo usam isto para não deixar identidade órfã no controller.
 */
export function bindTawkSessionReset(reset: TawkSessionReset | null): void {
  boundReset = reset;
}

/**
 * Encerra identidade autenticada no Tawk alinhada à sessão Akili.
 * Seguro chamar sem provider (fallback para logout do widget).
 */
export async function endAuthenticatedTawkSession(): Promise<void> {
  if (boundReset) {
    await boundReset();
    return;
  }
  await logoutTawk();
}
