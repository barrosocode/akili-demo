import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Primeiro acesso",
  robots: { index: false, follow: false },
};

export default function FirstAccessPage() {
  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <h2 className="sec-title">Primeiro acesso</h2>
        <p>
          Use o link enviado pela escola ou conclua seu cadastro para acessar o
          portal.
        </p>
        <p>
          <Link href="/signin" className="vs-btn">
            Ir para o login
          </Link>{" "}
          <Link href="/cadastro" className="vs-btn">
            Cadastre-se
          </Link>
        </p>
      </div>
    </section>
  );
}
