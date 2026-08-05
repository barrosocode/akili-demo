import { jsonError, jsonSuccess } from "@/lib/api/response";
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
    await clearAuthCookies();
    return jsonError(error);
  }
}
