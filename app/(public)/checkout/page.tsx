import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/portal/auth/AuthShell";

import "@/styles/marketing.css";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <AuthShell>
      <section className="space-top space-extra-bottom">
        <div className="container text-center">
          <h2 className="sec-title">Checkout</h2>
          <p>
            O fluxo de contratação estará disponível em breve. Enquanto isso,
            conheça os planos ou faça login.
          </p>
          <p>
            <Link href="/preco-e-planos" className="vs-btn">
              Ver planos
            </Link>{" "}
            <Link href="/signin" className="vs-btn">
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </AuthShell>
  );
}
