import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aceitar convite",
};

export default function InvitePage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Aceitar convite</h1>
      <p className="text-sm text-muted-foreground">
        Defina sua senha para acessar os alunos vinculados pela escola.
      </p>
    </div>
  );
}
