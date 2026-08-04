import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/page-header";

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  return (
    <>
      <PageHeader
        title="Detalhes do aluno"
        description="Progresso e informações do aluno selecionado."
        breadcrumbs={[
          { label: "Meus filhos", href: "/" },
          { label: "Detalhes" },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Referência interna carregada com sucesso.
      </p>
      <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}>
        Voltar
      </Link>
    </>
  );
}
