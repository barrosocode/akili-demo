import type { NextRequest } from "next/server";
import { z } from "zod";
import { laravelRequest } from "@/lib/api/laravel-client";
import { fromRef } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";

const acceptSchema = z.object({
  documentRef: z.string().min(1, "Documento inválido"),
  latitude: z
    .number({ required_error: "Localização obrigatória." })
    .min(-90)
    .max(90),
  longitude: z
    .number({ required_error: "Localização obrigatória." })
    .min(-180)
    .max(180),
  locationAccuracyMeters: z.number().min(0).nullable().optional(),
  clientMetadata: z
    .object({
      channel: z.literal("client-portal"),
      browser: z.string().max(255).nullable().optional(),
      os: z.string().max(255).nullable().optional(),
      locale: z.string().max(32).nullable().optional(),
      timezone: z.string().max(64).nullable().optional(),
      screen: z.string().max(32).nullable().optional(),
      viewport: z.string().max(32).nullable().optional(),
      referrer: z.string().max(2048).nullable().optional(),
      platform: z.string().max(64).nullable().optional(),
      color_depth: z.number().int().min(0).nullable().optional(),
      pixel_ratio: z.number().min(0).nullable().optional(),
      languages: z.array(z.string().max(32)).nullable().optional(),
      accepted_at_client: z.string().max(64).nullable().optional(),
      geolocation_unavailable: z.boolean().optional(),
      geolocation_denied: z.boolean().optional(),
    })
    .passthrough(),
});

function resolveClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return request.headers.get("cf-connecting-ip")?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const parsed = acceptSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const documentUuid = fromRef(parsed.data.documentRef);
    if (!documentUuid) {
      return validationError({ documentRef: "Documento inválido" });
    }

    if (
      parsed.data.clientMetadata.geolocation_denied === true ||
      parsed.data.clientMetadata.geolocation_unavailable === true
    ) {
      return validationError({
        latitude:
          "É necessário permitir o acesso à localização para aceitar os termos.",
      });
    }

    const clientIp = resolveClientIp(request);
    const userAgent = request.headers.get("user-agent");
    const acceptLanguage = request.headers.get("accept-language");

    const forensicHeaders: Record<string, string> = {};
    if (clientIp) forensicHeaders["X-Forwarded-For"] = clientIp;
    if (userAgent) forensicHeaders["User-Agent"] = userAgent;
    if (acceptLanguage) forensicHeaders["Accept-Language"] = acceptLanguage;

    const acceptance = await laravelRequest<unknown>("/consents/accept", {
      method: "POST",
      headers: forensicHeaders,
      data: {
        document_uuid: documentUuid,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        location_accuracy_meters: parsed.data.locationAccuracyMeters ?? null,
        client_metadata: {
          ...parsed.data.clientMetadata,
          geolocation_denied: false,
          geolocation_unavailable: false,
        },
      },
    });

    return jsonSuccess(acceptance, 201);
  } catch (error) {
    return jsonError(error);
  }
}
