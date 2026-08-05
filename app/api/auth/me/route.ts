import { jsonError, jsonSuccess } from "@/lib/api/response";
import { toApiError } from "@/lib/api/errors";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      await clearAuthCookies();
      return jsonError({ title: "Não autenticado", status: 401 });
    }
    return jsonSuccess(session);
  } catch (error) {
    const apiError = toApiError(error);
    // Só limpa cookie em não-autenticado — 5xx não deve apagar sessão válida.
    if (apiError.status === 401) {
      await clearAuthCookies();
    }
    return jsonError(error);
  }
}
