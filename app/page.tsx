import { getServerSession } from "@/lib/auth/session";
import { GuardianShell } from "@/components/layout/guardian-shell";
import { PublicHome } from "@/components/layout/public-home";
import { GuardianGuard } from "@/features/auth";
import { ChildrenHome } from "@/features/children";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session) {
    return <PublicHome />;
  }

  return (
    <GuardianGuard>
      <GuardianShell>
        <ChildrenHome />
      </GuardianShell>
    </GuardianGuard>
  );
}
