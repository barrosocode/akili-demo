"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  consentsBff,
  type ConsentDocument,
  type PendingConsent,
} from "@/services/bff/consents.bff";
import { BffClientError } from "@/services/bff/client";
import { useSession } from "@/providers/session-provider";
import {
  buildClientMetadata,
  geolocationErrorMessage,
  getGeolocationPermissionState,
  hasValidGeolocation,
  permissionGuidanceMessage,
  requestGeolocation,
  type GeolocationPermissionState,
  type GeolocationResult,
} from "@/lib/consent/forensics";

export function TermsAcceptForm() {
  const router = useRouter();
  const { refetch } = useSession();
  const [pending, setPending] = useState<PendingConsent[]>([]);
  const [current, setCurrent] = useState<ConsentDocument | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [geo, setGeo] = useState<GeolocationResult | null>(null);
  const [permissionState, setPermissionState] =
    useState<GeolocationPermissionState>("unsupported");
  const [error, setError] = useState<string | null>(null);

  const locationReady = hasValidGeolocation(geo);
  const guidance = permissionGuidanceMessage(permissionState);

  const refreshPermissionState = useCallback(async () => {
    const state = await getGeolocationPermissionState();
    setPermissionState(state);
    return state;
  }, []);

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await consentsBff.pending();
      setPending(items);
      if (items.length === 0) {
        await refetch();
        router.replace("/");
        return;
      }
      const document = await consentsBff.document(items[0].key);
      setCurrent(document);
      setAccepted(false);
    } catch (err) {
      setError(
        err instanceof BffClientError
          ? (err.detail ?? err.title)
          : "Não foi possível carregar os termos."
      );
    } finally {
      setLoading(false);
    }
  }, [refetch, router]);

  useEffect(() => {
    void loadPending();
  }, [loadPending]);

  // Só consulta o estado da permissão — NÃO dispara getCurrentPosition no mount
  // (sem gesto do usuário o browser costuma bloquear o popup).
  useEffect(() => {
    if (!current?.documentRef) return;

    setAccepted(false);
    setError(null);
    setSubmitting(false);
    setIsLocating(false);
    setGeo(null);

    void (async () => {
      const state = await refreshPermissionState();
      if (state === "granted") {
        setIsLocating(true);
        try {
          const result = await requestGeolocation({ maximumAge: 60_000 });
          setGeo(result);
          if (!hasValidGeolocation(result)) {
            setError(geolocationErrorMessage(result));
          }
        } finally {
          setIsLocating(false);
        }
      }
    })();
  }, [current?.documentRef, refreshPermissionState]);

  /**
   * Handler de clique: getCurrentPosition DEVE ser a primeira chamada síncrona
   * para o browser associar ao gesto do usuário e abrir o prompt.
   * Não usar await antes desta chamada.
   */
  function handleAllowLocationClick() {
    const pendingGeo = requestGeolocation({ maximumAge: 0 });
    setError(null);
    setIsLocating(true);

    void pendingGeo
      .then(async (result) => {
        setGeo(result);
        const state = await refreshPermissionState();
        setPermissionState(state);

        if (!hasValidGeolocation(result)) {
          setError(geolocationErrorMessage(result));
          return;
        }

        setError(null);
      })
      .finally(() => {
        setIsLocating(false);
      });
  }

  async function advanceAfterAccept() {
    if (!current) return;
    const remaining = pending.filter((item) => item.key !== current.key);
    if (remaining.length === 0) {
      await refetch();
      router.replace("/");
      return;
    }
    setPending(remaining);
    const next = await consentsBff.document(remaining[0].key);
    setCurrent(next);
  }

  async function onAccept() {
    if (!current || !accepted || !locationReady || !geo || submitting || isLocating) {
      return;
    }

    setSubmitting(true);
    setError(null);
    const acceptedAtClient = new Date().toISOString();

    try {
      await consentsBff.accept({
        documentRef: current.documentRef,
        latitude: geo.latitude,
        longitude: geo.longitude,
        locationAccuracyMeters: geo.accuracyMeters,
        clientMetadata: buildClientMetadata(geo, acceptedAtClient),
      });

      await advanceAfterAccept();
    } catch (err) {
      if (err instanceof BffClientError && err.status === 409) {
        await advanceAfterAccept();
        return;
      }
      setError(
        err instanceof BffClientError
          ? (err.detail ?? err.title)
          : "Não foi possível registrar o aceite."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container space-top" role="status">
        <p>Carregando termos...</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="container space-top">
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
        <p>Nenhum termo pendente.</p>
      </div>
    );
  }

  const busy = submitting || isLocating;
  const canSubmit = accepted && locationReady && !busy;
  const isDenied = permissionState === "denied" || geo?.geolocationDenied === true;
  const locationButtonLabel = isLocating
    ? "Aguardando permissão do navegador..."
    : isDenied
      ? "Já liberei, tentar novamente"
      : "Permitir localização";

  return (
    <section className="space-top space-extra-bottom">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <h2 className="sec-title mb-2">{current.title}</h2>
            <p className="mb-4">
              Versão {current.version}. Leia com atenção e aceite para continuar.
            </p>
            <p className="mb-4 text-muted">
              A localização é <strong>obrigatória</strong>. Toque em{" "}
              <strong>Permitir localização</strong> para o navegador pedir sua
              autorização.
            </p>

            {!locationReady ? (
              <div className="mb-4">
                {guidance && !error ? (
                  <p className="alert alert-info" role="status">
                    {guidance}
                  </p>
                ) : null}
                <button
                  type="button"
                  className="vs-btn"
                  onClick={handleAllowLocationClick}
                >
                  {locationButtonLabel}
                </button>
              </div>
            ) : (
              <p className="mb-4 alert alert-success" role="status">
                Localização obtida. Você já pode aceitar os termos.
              </p>
            )}

            {error ? (
              <p style={{ color: "red" }}>
                <strong>{error}</strong>
              </p>
            ) : null}

            <div
              className="blog-content mb-4"
              style={{
                maxHeight: "50vh",
                overflow: "auto",
                border: "1px solid #eee",
                padding: "1.25rem",
                borderRadius: "8px",
                background: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: current.contentHtml }}
            />
            <p className="mb-3 text-muted">
              Restam {pending.length} documento(s) para aceitar.
            </p>
            <label className="d-flex align-items-start gap-2 mb-4">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                disabled={busy || !locationReady}
                style={{ marginTop: 4 }}
              />
              <span>
                Li e aceito este documento na versão {current.version}.
              </span>
            </label>
            <button
              type="button"
              className="vs-btn"
              onClick={() => void onAccept()}
              disabled={!canSubmit}
            >
              {submitting ? "Registrando..." : "Li e aceito"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
