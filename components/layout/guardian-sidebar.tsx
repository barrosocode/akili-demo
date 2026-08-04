"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, CreditCard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/providers/session-provider";

const NAV_ITEMS = [
  { href: "/", label: "Meus filhos", icon: Baby },
  { href: "/purchases", label: "Compras", icon: CreditCard, requiresPurchase: true },
  { href: "/profile", label: "Perfil", icon: User },
] as const;

export function GuardianSidebar() {
  const pathname = usePathname();
  const { user } = useSession();

  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Navegação principal">
      <div className="mb-6 px-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Portal do Responsável
        </p>
        <p className="mt-1 text-sm font-semibold">{user?.name ?? "Akili"}</p>
      </div>

      {NAV_ITEMS.filter(
        (item) => !("requiresPurchase" in item) || user?.capabilities.canPurchase
      ).map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
