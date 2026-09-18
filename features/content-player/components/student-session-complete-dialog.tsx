"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type StudentSessionCompleteDialogProps = {
  title: string;
  message: string;
  durationLabel: string;
  percentLabel: string;
  onConfirm: () => void;
};

export function formatSessionDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  if (safe < 60) return `${safe} s`;
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  if (minutes < 60) {
    return rest > 0 ? `${minutes} min ${rest} s` : `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const minRest = minutes % 60;
  return minRest > 0 ? `${hours} h ${minRest} min` : `${hours} h`;
}

export function StudentSessionCompleteDialog({
  title,
  message,
  durationLabel,
  percentLabel,
  onConfirm,
}: StudentSessionCompleteDialogProps) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        onConfirm();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted, onConfirm]);

  if (!mounted) return null;

  return createPortal(
    <div className="marketing-root">
      <div className="study-complete-dialog-backdrop">
        <div
          className="widget study-complete-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <p className="study-complete-dialog__emoji" aria-hidden="true">
            ★
          </p>
          <h2 id={titleId} className="widget_title">
            {title}
          </h2>
          <p>{message}</p>
          <div className="study-complete-dialog__stats" aria-label="Resumo da sessão">
            <div>
              <strong>{durationLabel}</strong>
              <span>Tempo desta sessão</span>
            </div>
            <div>
              <strong>{percentLabel}</strong>
              <span>Progresso da sessão</span>
            </div>
          </div>
          <button
            ref={confirmRef}
            type="button"
            className="vs-btn"
            onClick={onConfirm}
          >
            Ok
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
