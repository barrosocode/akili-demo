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
  content?: string;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> }
) {
  try {
    await requireAuth();
    const { key } = await context.params;
    const document = await laravelRequest<ConsentDocumentApi>(
      `/consents/documents/${encodeURIComponent(key)}`
    );

    return jsonSuccess({
      key: document.key,
      title: document.title,
      version: document.version,
      type: document.type,
      documentRef: toRef(document.uuid),
      contentHtml: document.content_html ?? document.content ?? "",
    });
  } catch (error) {
    return jsonError(error);
  }
}
