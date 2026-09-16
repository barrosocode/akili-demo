"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { assistanceBff } from "@/services/bff/assistance.bff";
import { BffClientError } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import { getUserFacingApiMessage } from "@/lib/api/errors";

const GENERIC_ERROR =
  "Não foi possível iniciar o atendimento. Solicite um novo acesso ao suporte.";

/**
 * Consome `?code=` uma vez via BFF e redireciona para o portal (sem PAT no client).
 */
export function AssistanceAdoptClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const startedRef = useRef(false);
  const [message, setMessage] = useState("Abrindo o portal em modo atendimento…");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const code = searchParams.get("code")?.trim() ?? "";

    // Remove o code da URL imediatamente (antes mesmo do POST).
    router.replace("/assistance/adopt", { scroll: false });

    if (!code || code.length < 32) {
      setFailed(true);
      setMessage(GENERIC_ERROR);
      return;
    }

    void (async () => {
      try {
        const result = await assistanceBff.adopt({ code });

        await queryClient.cancelQueries({ queryKey: queryKeys.auth.me });
        queryClient.setQueryData(queryKeys.auth.me, result.session);
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });

        router.replace(result.redirectTo || "/");
        router.refresh();
      } catch (error) {
        setFailed(true);
        setMessage(
          error instanceof BffClientError
            ? getUserFacingApiMessage(error, GENERIC_ERROR)
            : GENERIC_ERROR
        );
      }
    })();
  }, [queryClient, router, searchParams]);

  return (
    <main className="container space-top space-extra-bottom" role="status">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h1 className="h4 mb-3">Atendimento</h1>
          <p className={failed ? "text-danger" : undefined}>{message}</p>
          {failed ? (
            <p className="mb-0">
              <a href="/signin">Voltar ao login</a>
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
