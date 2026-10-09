import { laravelResource } from "@/lib/api/laravel-client";
import { forbidden, jsonError, jsonSuccess } from "@/lib/api/response";
import { toRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { can } from "@/lib/permissions/can";

interface ChildRegistrationDocumentApi {
  uuid?: unknown;
  key?: unknown;
  title?: unknown;
  version?: unknown;
  content_html?: unknown;
  is_required?: unknown;
}

function mapDocument(document: ChildRegistrationDocumentApi) {
  if (typeof document.uuid !== "string" || !document.uuid) return null;
  if (typeof document.key !== "string" || !document.key.trim()) return null;
  if (typeof document.title !== "string" || !document.title.trim()) return null;

  return {
    ref: toRef(document.uuid),
    key: document.key,
    title: document.title,
    version: typeof document.version === "string" ? document.version : "",
    contentHtml: typeof document.content_html === "string" ? document.content_html : "",
    isRequired: document.is_required !== false,
  };
}

export async function GET() {
  try {
    const session = await requireAuth();
    if (
      !session.capabilities.canAddChildren ||
      !can(session.permissions, "guardian.children.create")
    ) {
      return forbidden("Você não tem permissão para cadastrar um filho.");
    }

    const documents = await laravelResource<ChildRegistrationDocumentApi[]>(
      "/guardian/child-registration/consents",
      "documents"
    );

    return jsonSuccess(
      documents.flatMap((document) => {
        const mapped = mapDocument(document);
        return mapped ? [mapped] : [];
      })
    );
  } catch (error) {
    return jsonError(error);
  }
}
