import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar senha",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Recuperar senha</h1>
      <p className="text-sm text-muted-foreground">
        Em breve você poderá recuperar sua senha por aqui.
      </p>
    </div>
  );
}
