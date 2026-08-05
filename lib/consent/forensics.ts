"use client";

import type {
  ConsentClientMetadata,
  GeolocationResult,
} from "@/types/consent-forensics";

export type { ConsentClientMetadata, GeolocationResult };

export type GeolocationPermissionState = PermissionState | "unsupported";

const GEO_TIMEOUT_MS = 15000;

const UNAVAILABLE_RESULT: GeolocationResult = {
  latitude: null,
  longitude: null,
  accuracyMeters: null,
  geolocationDenied: false,
  geolocationUnavailable: true,
};

const DENIED_RESULT: GeolocationResult = {
  latitude: null,
  longitude: null,
  accuracyMeters: null,
  geolocationDenied: true,
  geolocationUnavailable: false,
};

function readPosition(
  enableHighAccuracy: boolean,
  timeout: number,
  maximumAge: number
): Promise<GeolocationResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      resolve(UNAVAILABLE_RESULT);
      return;
    }

    if (!window.isSecureContext) {
      resolve(UNAVAILABLE_RESULT);
      return;
    }

    if (!navigator.geolocation) {
      resolve(UNAVAILABLE_RESULT);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: position.coords.accuracy,
          geolocationDenied: false,
          geolocationUnavailable: false,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve(DENIED_RESULT);
          return;
        }

        resolve({
          latitude: null,
          longitude: null,
          accuracyMeters: null,
          geolocationDenied: false,
          geolocationUnavailable: true,
        });
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  });
}

/**
 * Dispara o prompt nativo do navegador.
 * Deve ser chamado de forma síncrona a partir de um clique do usuário —
 * sem await antes desta chamada.
 *
 * Se high accuracy falhar por timeout, tenta novamente sem high accuracy.
 */
export function requestGeolocation(options?: {
  maximumAge?: number;
}): Promise<GeolocationResult> {
  const maximumAge = options?.maximumAge ?? 0;

  return readPosition(true, GEO_TIMEOUT_MS, maximumAge).then((first) => {
    if (hasValidGeolocation(first) || first.geolocationDenied) {
      return first;
    }

    // Fallback desktop / GPS fraco: tenta sem high accuracy.
    return readPosition(false, GEO_TIMEOUT_MS, maximumAge);
  });
}

export async function getGeolocationPermissionState(): Promise<GeolocationPermissionState> {
  if (typeof navigator === "undefined" || !navigator.permissions?.query) {
    return "unsupported";
  }

  try {
    const status = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });
    return status.state;
  } catch {
    return "unsupported";
  }
}

function detectOs(userAgent: string): string | null {
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) return "macOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return null;
}

export function hasValidGeolocation(geo: GeolocationResult | null): boolean {
  return (
    geo !== null &&
    typeof geo.latitude === "number" &&
    typeof geo.longitude === "number" &&
    Number.isFinite(geo.latitude) &&
    Number.isFinite(geo.longitude) &&
    !geo.geolocationDenied &&
    !geo.geolocationUnavailable
  );
}

export function permissionGuidanceMessage(
  state: GeolocationPermissionState
): string | null {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "A localização só funciona em conexão segura (HTTPS) ou localhost. Acesse o portal por um desses caminhos e tente novamente.";
  }

  if (state === "denied") {
    return "O navegador bloqueou a localização para este site. Clique no ícone de cadeado/informação ao lado da URL, altere Localização para “Permitir” e depois toque em “Já liberei, tentar novamente”.";
  }

  if (state === "prompt" || state === "unsupported") {
    return "Toque em “Permitir localização”. O navegador vai pedir sua autorização — aceite para continuar.";
  }

  return null;
}

export function geolocationErrorMessage(geo: GeolocationResult): string {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "A localização só funciona em conexão segura (HTTPS) ou localhost. Acesse o portal por um desses caminhos e tente novamente.";
  }

  if (geo.geolocationDenied) {
    return "O navegador bloqueou a localização. Clique no ícone de cadeado/informação ao lado da URL, permita a localização para este site e depois toque em “Já liberei, tentar novamente”.";
  }

  if (typeof navigator !== "undefined" && !navigator.geolocation) {
    return "Seu navegador não oferece localização. Use um dispositivo com GPS/localização habilitada para continuar.";
  }

  return "Não foi possível obter sua localização. Verifique se o GPS está ativo, permita o acesso quando o navegador pedir e tente novamente.";
}

export function buildClientMetadata(
  geo: GeolocationResult | null,
  acceptedAtClient?: string
): ConsentClientMetadata {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

  return {
    channel: "client-portal",
    browser: ua || null,
    os: detectOs(ua),
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    locale: typeof navigator !== "undefined" ? navigator.language : null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen:
      typeof window !== "undefined"
        ? `${window.screen.width}x${window.screen.height}`
        : null,
    viewport:
      typeof window !== "undefined"
        ? `${window.innerWidth}x${window.innerHeight}`
        : null,
    languages:
      typeof navigator !== "undefined" && navigator.languages.length > 0
        ? [...navigator.languages]
        : null,
    platform: typeof navigator !== "undefined" ? navigator.platform || null : null,
    color_depth:
      typeof window !== "undefined" ? (window.screen.colorDepth ?? null) : null,
    pixel_ratio:
      typeof window !== "undefined" ? (window.devicePixelRatio ?? null) : null,
    geolocation_denied: geo?.geolocationDenied ?? true,
    geolocation_unavailable: geo?.geolocationUnavailable ?? true,
    accepted_at_client: acceptedAtClient ?? null,
  };
}
