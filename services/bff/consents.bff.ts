import { bffClient } from "@/services/bff/client";
import type { ConsentClientMetadata } from "@/types/consent-forensics";

export interface PendingConsent {
  key: string;
  title: string;
  version: string;
  type: string;
  documentRef: string;
}

export interface ConsentDocument extends PendingConsent {
  contentHtml: string;
}

export interface AcceptConsentPayload {
  documentRef: string;
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracyMeters?: number | null;
  clientMetadata: ConsentClientMetadata;
}

export const consentsBff = {
  pending() {
    return bffClient<PendingConsent[]>("/api/consents/pending");
  },

  document(key: string) {
    return bffClient<ConsentDocument>(
      `/api/consents/documents/${encodeURIComponent(key)}`
    );
  },

  accept(payload: AcceptConsentPayload) {
    return bffClient<unknown>("/api/consents/accept", {
      method: "POST",
      body: payload,
    });
  },
};
