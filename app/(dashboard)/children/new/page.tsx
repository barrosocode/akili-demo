import { redirect } from "next/navigation";
import Link from "next/link";

import { getServerSession } from "@/lib/auth/session";

export default async function NewChildPage() {
  const session = await getServerSession();

  if (!session?.capabilities.canAddChildren) {
    redirect("/");
  }

  return (
    <div className="blog-content">
      <h2 className="blog-title">Adicionar filho</h2>
      <p>
        Em breve você poderá cadastrar um novo aluno por aqui. Enquanto isso,
        fale com o suporte ou conclua pelo onboarding após o checkout.
      </p>
      <p>
        <Link href="/" className="vs-btn">
          Voltar aos filhos
        </Link>
      </p>
    </div>
  );
}
