import type {
  TawkApi,
  TawkIdentity,
  TawkPublicConfig,
} from "@/features/support/tawk/tawk.types";

const SCRIPT_ID = "akili-tawk-script";

let loadPromise: Promise<void> | null = null;
/** Config injetada pelo server (GuardianDashboardShell → TawkProvider). */
let injectedConfig: TawkPublicConfig | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Registra a config pública no client (chamado pelo TawkProvider). */
export function setTawkPublicConfig(config: TawkPublicConfig | null): void {
  injectedConfig = config;
}

export function getTawkPublicConfig(): TawkPublicConfig | null {
  return injectedConfig;
}

function getTawkApi(): TawkApi | undefined {
  if (!isBrowser()) return undefined;
  return window.Tawk_API;
}

/**
 * Carrega o embed do Tawk somente no client. Seguro chamar múltiplas vezes.
 * Nunca acessa `window` durante SSR. Uma única inicialização compartilhada.
 */
export function ensureTawkLoaded(): Promise<void> {
  if (!isBrowser()) {
    return Promise.reject(new Error("Tawk disponível apenas no navegador."));
  }

  const config = getTawkPublicConfig();
  if (!config) {
    return Promise.reject(new Error("Tawk não configurado."));
  }

  if (getTawkApi()?.login) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  window.Tawk_API = window.Tawk_API ?? {};
  window.Tawk_LoadStart = new Date();

  loadPromise = new Promise<void>((resolve, reject) => {
    const previousOnLoad = window.Tawk_API?.onLoad;
    window.Tawk_API = window.Tawk_API ?? {};
    window.Tawk_API.onLoad = () => {
      try {
        previousOnLoad?.();
      } finally {
        // Oculta o launcher; maximize só no CTA após identify/login.
        window.Tawk_API?.hideWidget?.();
        resolve();
      }
    };

    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://embed.tawk.to/${config.propertyId}/${config.widgetId}`;
    script.charset = "UTF-8";
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("Não foi possível carregar o chat."));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

/**
 * Login autenticado. `identity` deve vir exclusivamente da Identity API Laravel.
 */
export function loginTawk(identity: TawkIdentity): Promise<void> {
  return new Promise((resolve, reject) => {
    const api = getTawkApi();
    if (!api?.login) {
      reject(new Error("Chat indisponível."));
      return;
    }

    api.login(
      {
        hash: identity.hash,
        userId: identity.user_id,
        name: identity.name,
        email: identity.email,
      },
      (error) => {
        if (error) {
          reject(new Error("Não foi possível identificar o usuário no chat."));
          return;
        }
        // FAB Akili no lugar do launcher Tawk.
        api.hideWidget?.();
        resolve();
      }
    );
  });
}

export function maximizeTawk(): void {
  const api = getTawkApi();
  if (!api) return;

  try {
    api.maximize?.();
  } catch {
    // Widget ausente ou ainda não pronto.
  }
}

/**
 * Encerra a sessão do visitante no Tawk. Sempre seguro (no-op fora do browser
 * ou se o widget nunca carregou).
 */
export function logoutTawk(): Promise<void> {
  if (!isBrowser()) {
    return Promise.resolve();
  }

  const api = getTawkApi();
  if (!api) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    try {
      if (api.logout) {
        api.logout(() => {
          try {
            api.shutdown?.();
          } finally {
            resolve();
          }
        });
      } else {
        api.shutdown?.();
        resolve();
      }
      api.hideWidget?.();
    } catch {
      resolve();
    }
  });
}
