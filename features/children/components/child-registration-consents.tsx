"use client";

import { useEffect, useId, useRef, useState, type UIEvent } from "react";
import { createPortal } from "react-dom";

import type { ChildRegistrationConsent } from "@/services/bff/consents.bff";

type ConsentsStatus = "loading" | "error" | "empty" | "ready";

interface ChildRegistrationConsentsProps {
  purchaseRef: string;
  documents: ChildRegistrationConsent[];
  status: ConsentsStatus;
  errorMessage: string | null;
  consentError: string | null;
  disabled: boolean;
  readRefs: ReadonlySet<string>;
  acceptedRefs: ReadonlySet<string>;
  onRetry: () => void;
  onMarkRead: (ref: string) => void;
  onToggleAccepted: (ref: string, accepted: boolean) => void;
}

export function ChildRegistrationConsents({
  purchaseRef,
  documents,
  status,
  errorMessage,
  consentError,
  disabled,
  readRefs,
  acceptedRefs,
  onRetry,
  onMarkRead,
  onToggleAccepted,
}: ChildRegistrationConsentsProps) {
  const [openRef, setOpenRef] = useState<string | null>(null);
  const openDocument = documents.find((document) => document.ref === openRef) ?? null;

  return (
    <div className="col-12 form-group">
      <h3 className="h5 mb-2">Termos do cadastro</h3>
      <p className="text-muted">
        Quem aceita é você, responsável. Leia cada documento e marque o aceite para
        cadastrar o filho.
      </p>

      {consentError ? (
        <div className="alert alert-danger" role="alert">
          {consentError}
        </div>
      ) : null}

      {status === "loading" ? <p role="status">Carregando termos...</p> : null}

      {status === "error" ? (
        <div className="alert alert-danger" role="alert">
          <strong>Não foi possível carregar os termos.</strong>
          <p className="mb-2">{errorMessage}</p>
          <button type="button" className="vs-btn" onClick={onRetry} disabled={disabled}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {status === "empty" ? (
        <div className="alert alert-warning" role="status">
          <strong>Os termos de cadastro do filho não estão disponíveis.</strong>
          <p className="mb-2">Tente de novo em instantes.</p>
          <button type="button" className="vs-btn" onClick={onRetry} disabled={disabled}>
            Tentar novamente
          </button>
        </div>
      ) : null}

      {status === "ready"
        ? documents.map((document) => {
            const inputId = `consent-${purchaseRef}-${document.ref}`;
            const hintId = `${inputId}-hint`;
            const hasRead = readRefs.has(document.ref);
            const accepted = acceptedRefs.has(document.ref);

            return (
              <div key={document.ref} className="mb-3">
                <p className="mb-1">
                  <strong>{document.title}</strong>
                  {document.version ? ` · Versão ${document.version}` : null}
                </p>
                <button
                  type="button"
                  className="vs-btn style3 mb-2"
                  onClick={() => setOpenRef(document.ref)}
                  disabled={disabled}
                >
                  Ler documento
                </button>
                <div className="form-group mb-1">
                  <input
                    id={inputId}
                    type="checkbox"
                    name={inputId}
                    checked={accepted}
                    disabled={disabled || !hasRead}
                    aria-describedby={hintId}
                    onChange={(event) =>
                      onToggleAccepted(document.ref, event.target.checked)
                    }
                  />
                  <label htmlFor={inputId}>Li e aceito este documento.</label>
                </div>
                <span id={hintId} className="text-muted d-block">
                  {hasRead
                    ? accepted
                      ? "Aceite registrado neste cadastro."
                      : "Marque o aceite para continuar."
                    : "Leia o documento para habilitar o aceite."}
                </span>
              </div>
            );
          })
        : null}

      {openDocument ? (
        <ConsentDocumentDialog
          consent={openDocument}
          alreadyRead={readRefs.has(openDocument.ref)}
          onClose={() => setOpenRef(null)}
          onMarkRead={() => onMarkRead(openDocument.ref)}
        />
      ) : null}
    </div>
  );
}

function ConsentDocumentDialog({
  consent,
  alreadyRead,
  onClose,
  onMarkRead,
}: {
  consent: ChildRegistrationConsent;
  alreadyRead: boolean;
  onClose: () => void;
  onMarkRead: () => void;
}) {
  const titleId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bodyRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onClose, consent.ref]);

  if (!mounted) return null;

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    const reachedEnd = element.scrollTop + element.clientHeight >= element.scrollHeight - 24;
    if (reachedEnd) onMarkRead();
  }

  return createPortal(
    <div className="marketing-root">
      <div className="child-consent-dialog-backdrop" onClick={onClose}>
        <div
          className="widget child-consent-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="child-consent-dialog__header">
            <h2 id={titleId} className="widget_title mb-0">
              {consent.title}
            </h2>
            <button type="button" className="vs-btn style3" onClick={onClose}>
              Fechar
            </button>
          </div>
          {consent.version ? <p className="mb-3">Versão {consent.version}</p> : null}
          <div
            ref={bodyRef}
            className="child-consent-dialog__body"
            tabIndex={0}
            onScroll={handleScroll}
            dangerouslySetInnerHTML={{ __html: consent.contentHtml }}
          />
          <div className="child-consent-dialog__footer">
            {alreadyRead ? (
              <p className="mb-2" role="status">
                Leitura confirmada. Você já pode marcar o aceite.
              </p>
            ) : (
              <p className="mb-2 text-muted">
                Role até o fim ou confirme a leitura para habilitar o aceite.
              </p>
            )}
            <button
              type="button"
              className="vs-btn"
              onClick={onMarkRead}
              disabled={alreadyRead}
            >
              {alreadyRead ? "Leitura confirmada" : "Confirmar leitura"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
