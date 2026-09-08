import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aceitar convite",
  robots: { index: false, follow: false },
};

/** Placeholder when the invite link has no token — real flow is /guardian/invite/[token]. */
export default function InvitePage() {
  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <h2 className="sec-title">Aceitar convite</h2>
        <p>
          Abra o link completo enviado por e-mail pela escola (ele inclui um
          código único). Se o link estiver desatualizado, peça um novo convite
          ou use o{" "}
          <Link href="/first-access">primeiro acesso</Link> com o e-mail
          cadastrado.
        </p>
        <p>
          <Link href="/signin" className="vs-btn">
            Já tenho conta — entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
