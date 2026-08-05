import type { Metadata } from "next";

import { SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <SignInForm />;
}
