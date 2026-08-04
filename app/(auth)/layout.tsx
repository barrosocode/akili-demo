import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold">
            Akili
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Portal do Responsável
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">{children}</div>
        <p className="text-center text-sm text-muted-foreground">
          É uma escola?{" "}
          <a
            href={process.env.ADMIN_APP_URL ?? "http://localhost:3001"}
            className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
          >
            Acesse o painel administrativo
          </a>
        </p>
      </div>
    </div>
  );
}
