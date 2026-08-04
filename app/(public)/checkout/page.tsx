import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contratar",
};

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-4 rounded-xl border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          O fluxo de contratação B2C será implementado na próxima etapa.
        </p>
        <Link href="/signin" className={cn(buttonVariants())}>
          Ir para login
        </Link>
      </div>
    </div>
  );
}
