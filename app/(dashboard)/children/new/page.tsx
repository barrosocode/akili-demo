import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AddChildPage } from "@/features/children";
import { getServerSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Adicionar filho",
  robots: { index: false, follow: false },
};

export default async function NewChildPage() {
  const session = await getServerSession();

  if (!session?.capabilities.canAddChildren) {
    redirect("/");
  }

  return <AddChildPage />;
}
