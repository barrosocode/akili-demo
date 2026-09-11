"use client";

import { useState } from "react";
import { SupportHelpModal } from "@/features/support/components/support-help-modal";

export function SupportFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="akili-support-fab"
        aria-label="Abrir Central de Ajuda"
        title="Central de Ajuda"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="akili-support-fab__icon" aria-hidden="true">
          ?
        </span>
      </button>
      <SupportHelpModal open={open} onOpenChange={setOpen} />
    </>
  );
}
