import type { Metadata } from "next";
import { SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesse sua conta para acompanhar seus filhos.
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
