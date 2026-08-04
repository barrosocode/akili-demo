import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getServerSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return jsonError({ title: "Não autenticado", status: 401 });
    }
    return jsonSuccess(session);
  } catch (error) {
    return jsonError(error);
  }
}
