export interface GeolocationResult {
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  geolocationDenied: boolean;
  geolocationUnavailable: boolean;
}

export interface ConsentClientMetadata {
  channel: "client-portal";
  browser: string | null;
  os: string | null;
  referrer: string | null;
  locale: string | null;
  timezone: string | null;
  screen: string | null;
  viewport: string | null;
  languages: string[] | null;
  platform: string | null;
  color_depth: number | null;
  pixel_ratio: number | null;
  geolocation_denied: boolean;
  geolocation_unavailable: boolean;
  accepted_at_client: string | null;
}
