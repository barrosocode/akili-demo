import type { Metadata } from "next";

import { ChildrenHome } from "@/features/children";

export const metadata: Metadata = {
  title: "Meus filhos",
  robots: { index: false, follow: false },
};

/**
 * Lista de filhos — mesma experiência da home logada.
 */
export default function ChildrenIndexPage() {
  return <ChildrenHome />;
}
