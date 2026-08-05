import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aceitar convite",
  robots: { index: false, follow: false },
};

export default function InvitePage() {
  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <h2 className="sec-title">Aceitar convite</h2>
        <p>
          Defina sua senha para acessar os alunos vinculados pela escola. Se você
          recebeu um link completo, abra-o diretamente do e-mail.
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
