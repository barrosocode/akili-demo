"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/constants/site";
import { DemoPersonaSwitcher } from "@/features/demo";
import { isAssistanceReadOnly } from "@/lib/permissions/guardian-capabilities";
import { useSession } from "@/providers/session-provider";
import { useLogoutMutation } from "@/services/queries/auth.mutations";

type GuardianHeaderProps = {
  cartTotalLabel?: string;
};

/**
 * Header clean do responsável (PORTAL-006).
 */
export function GuardianHeader({ cartTotalLabel = "0,00" }: GuardianHeaderProps) {
  const { user } = useSession();
  const logout = useLogoutMutation();
  const router = useRouter();
  const displayName = user?.name ?? "Responsável";
  const readOnly = isAssistanceReadOnly(user);

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      router.push("/signin");
      router.refresh();
    } catch {
      router.push("/signin");
    }
  }

  return (
    <header className="vs-header header-layout4">
      {!readOnly ? (
        <div className="header-top4">
          <div className="container-style4">
            <DemoPersonaSwitcher />
          </div>
        </div>
      ) : null}
      <div className="sticky-wrap">
        <div className="sticky-active">
          <div className="container-style4">
            <div className="header-lower4">
              <div className="row gx-3 align-items-center justify-content-between">
                <div className="col-8 col-sm-auto">
                  <div className="header-logo2">
                    <Link href="/">
                      <Image
                        src={siteConfig.assets.logoPositive.src}
                        alt={siteConfig.brand.name}
                        width={siteConfig.assets.logoPositive.width}
                        height={siteConfig.assets.logoPositive.height}
                        priority
                      />
                    </Link>
                  </div>
                </div>
                <div className="col">
                  <span style={{ fontSize: 15 }}>
                    Bem-vindo(a),{" "}
                    {readOnly ? (
                      <span>{displayName}</span>
                    ) : (
                      <Link href="/profile">{displayName}</Link>
                    )}
                  </span>
                  {readOnly ? (
                    <span
                      className="d-block"
                      style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}
                    >
                      Visualização somente leitura
                    </span>
                  ) : null}
                </div>
                <div className="col-auto d-none d-lg-block">
                  <div className="header-icons4">
                    {!readOnly ? (
                      <Link
                        href="/purchases"
                        className="simple-icon cart"
                        title="Compras"
                      >
                        <i className="fa fa-shopping-cart" aria-hidden />
                        <span>R$ {cartTotalLabel}</span>
                      </Link>
                    ) : (
                      <span
                        className="simple-icon cart"
                        title="Compras indisponíveis no modo atendimento"
                        aria-disabled="true"
                        style={{ opacity: 0.45, cursor: "not-allowed" }}
                      >
                        <i className="fa fa-shopping-cart" aria-hidden />
                        <span>R$ {cartTotalLabel}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      className="simple-icon cart"
                      style={{
                        marginLeft: 20,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        void handleLogout();
                      }}
                      disabled={logout.isPending}
                    >
                      <i className="fas fa-sign-out-alt" aria-hidden /> Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
