"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/constants/site";
import { useSession } from "@/providers/session-provider";
import { useLogoutMutation } from "@/services/queries/auth.mutations";

/**
 * Header clean do aluno (PORTAL-012).
 */
export function AlunoHeader() {
  const { user } = useSession();
  const logout = useLogoutMutation();
  const router = useRouter();
  const displayName = user?.name ?? "Aluno";

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
      <div className="sticky-wrap">
        <div className="sticky-active">
          <div className="container-style4">
            <div className="header-lower4">
              <div className="row gx-3 align-items-center justify-content-between">
                <div className="col-8 col-sm-auto">
                  <div className="header-logo2">
                    <Link href="/aluno">
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
                    Olá, <strong>{displayName}</strong>
                  </span>
                </div>
                <div className="col-auto d-none d-lg-block">
                  <button
                    type="button"
                    className="simple-icon cart"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
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
    </header>
  );
}
