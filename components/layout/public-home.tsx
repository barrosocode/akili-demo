import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHome() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
          <span className="text-lg font-semibold">Akili</span>
          <div className="flex items-center gap-2">
            <Link href="/signin" className={cn(buttonVariants({ variant: "ghost" }))}>
              Entrar
            </Link>
            <Link href="/checkout" className={cn(buttonVariants())}>
              Contratar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-4 py-16 md:px-8">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">
          Acompanhe a jornada de aprendizado dos seus filhos
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Portal exclusivo para responsáveis. Contrate planos, acompanhe progresso e
          gerencie consentimentos em um só lugar.
        </p>
        <div className="flex gap-3">
          <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }))}>
            Começar agora
          </Link>
          <Link
            href="/signin"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Já tenho conta
          </Link>
        </div>
      </main>
    </div>
  );
}
