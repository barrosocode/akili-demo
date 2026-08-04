import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

export default async function NewChildPage() {
  const session = await getServerSession();

  if (!session?.capabilities.canAddChildren) {
    redirect("/");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Adicionar filho</h1>
      <p className="text-sm text-muted-foreground">
        Formulário de cadastro de filho disponível na próxima etapa.
      </p>
    </div>
  );
}
