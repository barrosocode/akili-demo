export { AssistanceBanner } from "./components/AssistanceBanner";
export { AssistanceAdoptClient } from "./components/AssistanceAdoptClient";
export { AssistanceEnterClient } from "./components/AssistanceEnterClient";
export { AssistanceExpiryWatcher } from "./components/AssistanceExpiryWatcher";
export { AssistanceNavigationReporter } from "./components/AssistanceNavigationReporter";
export { AssistanceShellChrome } from "./components/AssistanceShellChrome";
export {
  applyAssistanceCapabilities,
  assertAdoptResponseHasNoSecrets,
  isAssistanceReadOnly,
  mapPortalAssistance,
} from "./assistance-session";
export {
  ASSISTANCE_BANNER_CSS_CLASSES,
  ASSISTANCE_BANNER_HEIGHT_VAR,
  ASSISTANCE_BANNER_HTML_ATTR,
  ASSISTANCE_BANNER_SHELL_MOUNT_POINTS,
  resolveAssistanceBannerContent,
  shouldRenderAssistanceBanner,
} from "./assistance-chrome";
export { shouldShowMarketingHome } from "./home-guard";
export {
  ASSISTANCE_ADOPT_PATH,
  ASSISTANCE_ENTER_PATH,
} from "./paths";
export {
  assertNavigatePayloadHasOnlyPathAndLabel,
  buildAssistanceNavigatePayload,
  isAssistanceHandoffPath,
  normalizeAssistancePath,
  resolveAssistancePageLabel,
  shouldReportAssistanceNavigation,
} from "./navigation";
