export { TawkProvider } from "@/features/support/tawk/TawkProvider";
export { TawkWidget } from "@/features/support/tawk/TawkWidget";
export { useTawk } from "@/features/support/tawk/useTawk";
export {
  createTawkSessionController,
  tawkSessionKeyFromUser,
} from "@/features/support/tawk/tawk-session";
export {
  bindTawkSessionReset,
  endAuthenticatedTawkSession,
} from "@/features/support/tawk/tawk-lifecycle";
export {
  ensureTawkLoaded,
  getTawkPublicConfig,
  readTawkPublicConfigFromEnv,
  setTawkPublicConfig,
  loginTawk,
  logoutTawk,
  maximizeTawk,
} from "@/features/support/tawk/tawk.service";
export type {
  TawkContextValue,
  TawkIdentity,
  TawkPublicConfig,
  TawkStatus,
} from "@/features/support/tawk/tawk.types";
