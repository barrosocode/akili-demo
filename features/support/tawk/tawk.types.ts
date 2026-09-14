export type TawkIdentity = {
  user_id: string;
  name: string;
  email: string;
  hash: string;
};

export type TawkPublicConfig = {
  propertyId: string;
  widgetId: string;
};

export type TawkLoginPayload = {
  hash: string;
  userId: string;
  name: string;
  email: string;
};

export type TawkApi = {
  hideWidget?: () => void;
  showWidget?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  login?: (data: TawkLoginPayload, callback?: (error?: unknown) => void) => void;
  logout?: (callback?: (error?: unknown) => void) => void;
  shutdown?: () => void;
  onLoad?: () => void;
  autoStart?: boolean;
};

export type TawkStatus = "idle" | "loading" | "ready" | "unavailable";

export type TawkContextValue = {
  status: TawkStatus;
  isReady: boolean;
  /** Property/widget IDs foram injetados pelo server. */
  isConfigured: boolean;
  isAvailable: boolean;
  /** Abre o chat; `false` se Tawk/sessão indisponíveis (FAQ continua ok). */
  openChat: () => Promise<boolean>;
  maximize: () => void;
  logout: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}
