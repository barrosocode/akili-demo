"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupportTopicsPanel } from "@/features/support/components/support-topics-panel";

type SupportHelpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SupportHelpModal({ open, onOpenChange }: SupportHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="akili-support-modal"
        aria-describedby={undefined}
      >
        <DialogHeader className="akili-support-modal__header">
          <div className="akili-support-modal__header-row">
            <DialogTitle className="akili-support-modal__title">
              Como podemos ajudar?
            </DialogTitle>
            <DialogClose
              render={
                <button
                  type="button"
                  className="akili-support-modal__close"
                  aria-label="Fechar Central de Ajuda"
                />
              }
            >
              <i className="fas fa-times" aria-hidden="true" />
            </DialogClose>
          </div>
          <DialogDescription className="akili-support-modal__desc">
            Encontre respostas para suas dúvidas.
          </DialogDescription>
        </DialogHeader>

        <div className="akili-support-modal__body">
          <SupportTopicsPanel
            searchAutoFocus
            onNavigate={() => onOpenChange(false)}
          />
        </div>

        <div className="akili-support-modal__footer">
          <button type="button" className="vs-btn style3" disabled title="Em breve">
            Falar com suporte (em breve)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
