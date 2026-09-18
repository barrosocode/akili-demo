"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  canStartAssistanceForUser,
  supportDeskStatusLabel,
  supportDeskTypeLabel,
} from "@/features/support-desk/labels";
import type { SupportDeskUserListItem } from "@/features/support-desk/types";
import { supportDeskBff } from "@/services/bff/support-desk.bff";
import { BffClientError } from "@/services/bff/client";
import { SUPPORT_LOGIN_PATH } from "@/lib/auth/support-config";

function useDebounced(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function listErrorMessage(err: unknown): string {
  if (!(err instanceof BffClientError)) {
    return "Não foi possível carregar a lista.";
  }
  if (err.status === 403) {
    return "Você não tem permissão para listar usuários na mesa. Saia e entre novamente em Atendimento.";
  }
  return err.detail ?? err.title;
}

export function SupportDeskSearch() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("guardian");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SupportDeskUserListItem[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [operatorName, setOperatorName] = useState<string | null>(null);

  const debouncedSearch = useDebounced(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);
    try {
      const result = await supportDeskBff.listUsers({
        search: debouncedSearch.trim() || undefined,
        status: status || undefined,
        type: type || undefined,
        page,
        per_page: 15,
      });
      setItems(result.items);
      setLastPage(result.meta.last_page);
      setTotal(result.meta.total);
    } catch (err) {
      if (err instanceof BffClientError && err.status === 401) {
        window.location.assign(SUPPORT_LOGIN_PATH);
        return;
      }
      if (err instanceof BffClientError && err.status === 403) {
        setForbidden(true);
      }
      setError(listErrorMessage(err));
      setItems([]);
      setTotal(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, type, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void supportDeskBff
      .me()
      .then((user) => setOperatorName(user.name))
      .catch(() => setOperatorName(null));
  }, []);

  async function handleLogout() {
    try {
      await supportDeskBff.logout();
    } finally {
      window.location.assign(SUPPORT_LOGIN_PATH);
    }
  }

  const showEmpty = !loading && !error && items.length === 0;

  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <div className="row justify-content-between align-items-start mb-4 gy-3">
          <div className="col-lg-8">
            <h1 className="sec-title mb-2">Mesa de atendimento</h1>
            <p>
              Busque um responsável ativo para visualizar o portal em modo
              somente leitura.
            </p>
            {operatorName ? (
              <p className="mb-0">
                <strong>Operador:</strong> {operatorName}
              </p>
            ) : null}
          </div>
          <div className="col-lg-auto">
            <button type="button" className="vs-btn style4" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        <form
          className="form-style3 mb-4"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            void load();
          }}
        >
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="desk-search">Buscar</label>
              <input
                id="desk-search"
                type="search"
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Nome ou e-mail"
              />
            </div>
            <div className="col-md-3 form-group">
              <label htmlFor="desk-status">Status</label>
              <select
                id="desk-status"
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="active">Ativo</option>
                <option value="invited">Convite pendente</option>
                <option value="inactive">Inativo</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </div>
            <div className="col-md-3 form-group">
              <label htmlFor="desk-type">Tipo</label>
              <select
                id="desk-type"
                value={type}
                onChange={(event) => {
                  setPage(1);
                  setType(event.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="guardian">Responsável</option>
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
              </select>
            </div>
          </div>
        </form>

        {error ? (
          <div className="alert alert-danger" role="alert">
            <p className="mb-2">
              <strong>{error}</strong>
            </p>
            {forbidden ? (
              <p className="mb-0">
                <Link href={SUPPORT_LOGIN_PATH}>Entrar novamente na mesa</Link>
              </p>
            ) : null}
          </div>
        ) : null}

        {loading ? <p role="status">Carregando...</p> : null}

        {showEmpty ? (
          <p className="alert alert-info" role="status">
            Nenhum usuário encontrado com os filtros atuais.
          </p>
        ) : null}

        {!loading && items.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Status</th>
                  <th scope="col">Organização</th>
                  <th scope="col">
                    <span className="visually-hidden">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((user) => (
                  <tr key={user.uuid}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{supportDeskTypeLabel(user.type)}</td>
                    <td>{supportDeskStatusLabel(user.status)}</td>
                    <td>{user.tenant?.name ?? "—"}</td>
                    <td>
                      <Link
                        className="vs-btn style4"
                        href={`/suporte/usuarios/${user.uuid}`}
                      >
                        {canStartAssistanceForUser(user) ? "Abrir" : "Ver"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {lastPage > 1 && !error ? (
          <div className="row justify-content-between align-items-center mt-3 gy-2">
            <div className="col-auto">
              <p className="mb-0">{total} resultado(s)</p>
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="vs-btn style4 me-2"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Anterior
              </button>
              <span className="align-middle mx-2">
                Página {page} de {lastPage}
              </span>
              <button
                type="button"
                className="vs-btn style4"
                disabled={page >= lastPage || loading}
                onClick={() =>
                  setPage((current) => Math.min(lastPage, current + 1))
                }
              >
                Próxima
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
