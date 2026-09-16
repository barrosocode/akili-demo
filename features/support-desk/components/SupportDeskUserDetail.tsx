"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  canStartAssistanceForUser,
  supportDeskStatusLabel,
  supportDeskTypeLabel,
} from "@/features/support-desk/labels";
import type { SupportDeskUser } from "@/features/support-desk/types";
import { SUPPORT_HOME_PATH, SUPPORT_LOGIN_PATH } from "@/lib/auth/support-config";
import { supportDeskBff } from "@/services/bff/support-desk.bff";
import { BffClientError } from "@/services/bff/client";

type Props = {
  userUuid: string;
};

export function SupportDeskUserDetail({ userUuid }: Props) {
  const [user, setUser] = useState<SupportDeskUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startForbidden, setStartForbidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setStartForbidden(false);

    void supportDeskBff
      .getUser(userUuid)
      .then((payload) => {
        if (!cancelled) setUser(payload);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof BffClientError && err.status === 401) {
          window.location.assign(SUPPORT_LOGIN_PATH);
          return;
        }
        setError(
          err instanceof BffClientError
            ? (err.detail ?? err.title)
            : "Não foi possível carregar o usuário."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userUuid]);

  async function handleStart() {
    if (!user || starting) return;
    setStarting(true);
    setError(null);
    setStartForbidden(false);
    try {
      const result = await supportDeskBff.startAssistance(user.uuid);
      window.location.assign(result.redirectTo || "/");
    } catch (err) {
      setStarting(false);
      if (err instanceof BffClientError && err.status === 403) {
        setStartForbidden(true);
      }
      setError(
        err instanceof BffClientError
          ? (err.detail ?? err.title)
          : "Não foi possível iniciar o atendimento."
      );
    }
  }

  if (loading) {
    return (
      <section className="space-top">
        <div className="container">
          <p role="status">Carregando...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-top space-extra-bottom">
        <div className="container">
          <p className="alert alert-danger" role="alert">
            <strong>{error ?? "Usuário não encontrado."}</strong>
          </p>
          <p>
            <Link href={SUPPORT_HOME_PATH}>← Voltar à busca</Link>
          </p>
        </div>
      </section>
    );
  }

  const canStart = canStartAssistanceForUser(user) && !startForbidden;

  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <p className="mb-3">
          <Link href={SUPPORT_HOME_PATH}>← Voltar à busca</Link>
        </p>
        <h1 className="sec-title mb-2">{user.name}</h1>
        <p className="mb-4">{user.email}</p>

        {error ? (
          <div className="alert alert-danger" role="alert">
            <p className="mb-2">
              <strong>{error}</strong>
            </p>
            {startForbidden ? (
              <p className="mb-0">
                <Link href={SUPPORT_LOGIN_PATH}>Entrar novamente na mesa</Link>
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <p className="mb-1">
              <strong>Tipo</strong>
            </p>
            <p className="mb-0">{supportDeskTypeLabel(user.type)}</p>
          </div>
          <div className="col-md-4 mb-3">
            <p className="mb-1">
              <strong>Status</strong>
            </p>
            <p className="mb-0">{supportDeskStatusLabel(user.status)}</p>
          </div>
          <div className="col-md-4 mb-3">
            <p className="mb-1">
              <strong>Organização</strong>
            </p>
            <p className="mb-0">{user.tenant?.name ?? "—"}</p>
          </div>
        </div>

        {canStart ? (
          <div className="alert alert-info" role="status">
            <p className="mb-3">
              O atendimento abre o portal deste responsável em modo{" "}
              <strong>somente leitura</strong>. Nenhuma alteração de dados será
              permitida.
            </p>
            <button
              type="button"
              className="vs-btn"
              disabled={starting}
              onClick={() => void handleStart()}
            >
              {starting ? "Abrindo..." : "Iniciar atendimento"}
            </button>
          </div>
        ) : startForbidden ? null : (
          <p className="alert alert-warning" role="status">
            Somente responsáveis com conta ativa podem ser atendidos neste modo.
          </p>
        )}
      </div>
    </section>
  );
}
