import type { TawkPublicConfig } from "@/features/support/tawk/tawk.types";

/**
 * Lê IDs públicos só em Server Component — não importar via tawk.service (client).
 */
export function readTawkPublicConfig(): TawkPublicConfig | null {
  const propertyId = process.env.TAWK_PROPERTY_ID?.trim() ?? "";
  const widgetId = process.env.TAWK_WIDGET_ID?.trim() ?? "";
  if (!propertyId || !widgetId) return null;
  return { propertyId, widgetId };
}
