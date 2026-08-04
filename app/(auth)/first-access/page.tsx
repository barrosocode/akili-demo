import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primeiro acesso",
};

export default function FirstAccessPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Primeiro acesso</h1>
      <p className="text-sm text-muted-foreground">
        Use o link enviado pela escola ou conclua seu cadastro B2C.
      </p>
    </div>
  );
}
