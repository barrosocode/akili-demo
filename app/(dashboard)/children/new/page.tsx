import { redirect } from "next/navigation";
import Link from "next/link";

import { getServerSession } from "@/lib/auth/session";

export default async function NewChildPage() {
  const session = await getServerSession();

  if (!session?.capabilities.canAddChildren) {
    redirect("/");
  }

  const subscription = session.subscription;
  const atLimit =
    subscription?.limits.maxStudents != null &&
    subscription.limits.studentsUsed >= subscription.limits.maxStudents;

  return (
    <div className="blog-content">
      <h2 className="blog-title">Adicionar filho</h2>
      {subscription ? (
        <p>
          Plano <strong>{subscription.planName}</strong>:{" "}
          {subscription.limits.studentsUsed}
          {subscription.limits.maxStudents != null
            ? ` de ${subscription.limits.maxStudents}`
            : ""}{" "}
          filhos.
        </p>
      ) : null}

      {atLimit ? (
        <div className="alert alert-warning" role="status">
          Você atingiu o limite do plano. Faça upgrade para cadastrar mais
          filhos.
          <p className="mb-0 mt-2">
            <Link href="/purchases" className="vs-btn">
              Ver planos
            </Link>
          </p>
        </div>
      ) : (
        <div className="alert alert-info" role="status">
          O cadastro online de filhos estará disponível em breve. Nesta
          demonstração, os filhos já vêm vinculados à conta familiar.
        </div>
      )}

      <p>
        <Link href="/children" className="vs-btn">
          Voltar aos filhos
        </Link>
      </p>
    </div>
  );
}
