"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/services/queries/auth.mutations";
import { useSession } from "@/providers/session-provider";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";

export function AppHeader() {
  const { user } = useSession();
  const router = useRouter();
  const logout = useLogoutMutation();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      router.push("/signin");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof BffClientError
          ? error.detail ?? error.title
          : getUserFacingApiMessage(error)
      );
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-8">
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo(a)</p>
        <p className="font-medium">{user?.name ?? "Responsável"}</p>
      </div>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user?.avatarUrl ?? undefined} alt={user?.name ?? ""} />
          <AvatarFallback>{initials ?? "AK"}</AvatarFallback>
        </Avatar>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="size-4" aria-hidden />
          Sair
        </Button>
      </div>
    </header>
  );
}
