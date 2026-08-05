import { jsonError, jsonSuccess } from "@/lib/api/response";
import { toRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";

interface ConsentDocumentApi {
  uuid: string;
  key: string;
  title: string;
  version: string;
  type: string;
  content_html?: string;
}

export async function GET() {
  try {
    await requireAuth();
    const payload = await laravelRequest<
      ConsentDocumentApi[] | { data: ConsentDocumentApi[] }
    >("/consents/pending");
    const documents = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.data)
        ? payload.data
        : [];

    return jsonSuccess(
      documents.map((document) => ({
        key: document.key,
        title: document.title,
        version: document.version,
        type: document.type,
        documentRef: toRef(document.uuid),
      }))
    );
  } catch (error) {
    return jsonError(error);
  }
}
