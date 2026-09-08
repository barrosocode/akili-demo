import type { Metadata } from "next";
import { AcceptGuardianInviteForm } from "@/features/auth/components/accept-guardian-invite-form";

export const metadata: Metadata = {
  title: "Aceitar convite",
  robots: { index: false, follow: false },
};

export default function GuardianInviteTokenPage() {
  return (
    <section
      className="space-top"
      style={{
        backgroundImage: "url('/assets/img/bg/bg-con-1-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-xxl-6 align-self-center">
            <h2 className="sec-title mb-3">Aceitar convite</h2>
            <p className="mb-4">
              Defina sua senha para acompanhar o progresso do(s) seu(s) filho(s)
              no portal.
            </p>
            <AcceptGuardianInviteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
