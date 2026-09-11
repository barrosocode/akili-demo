"use client";

import { useId } from "react";

type SupportSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function SupportSearchField({
  value,
  onChange,
  placeholder = "Pesquise sua dúvida...",
  autoFocus = false,
}: SupportSearchFieldProps) {
  const id = useId();

  return (
    <div className="akili-support-search">
      <label htmlFor={id} className="visually-hidden">
        Pesquisar na Central de Ajuda
      </label>
      <span className="akili-support-search__icon" aria-hidden="true">
        <i className="fas fa-search" />
      </span>
      <input
        id={id}
        type="search"
        className="akili-support-search__input form-control"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
      />
    </div>
  );
}
