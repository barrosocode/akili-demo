/**
 * Home (`/`) must not show the public marketing landing when an assistance
 * cookie exists but the RSC session is not ready yet.
 */
export function shouldShowMarketingHome(options: {
  hasSession: boolean;
  hasAssistanceCookie: boolean;
}): boolean {
  if (options.hasSession) return false;
  if (options.hasAssistanceCookie) return false;
  return true;
}
