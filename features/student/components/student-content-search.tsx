"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { useStudentMaterialsQuery } from "@/features/student/hooks/use-student-materials";
import type { StudentMaterial } from "@/types/student-learning";

const SEARCH_DEBOUNCE_MS = 300;

export type StudentContentSearchState = {
  materials: StudentMaterial[];
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  isSearchActive: boolean;
};

export type StudentContentSearchProps = {
  subjectUuid?: string;
  children: (state: StudentContentSearchState) => ReactNode;
};

export function StudentContentSearch({
  subjectUuid,
  children,
}: StudentContentSearchProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [committed, setCommitted] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCommitted(value);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value]);

  function applyNow() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCommitted(value);
  }

  const query = useStudentMaterialsQuery(true, committed, subjectUuid);
  const isSearchActive = committed.trim().length >= 2;

  return (
    <div className="akili-content-search">
      <label className="akili-content-search__label" htmlFor={inputId}>
        Buscar conteúdos
      </label>
      <div className="akili-content-search__field">
        <input
          id={inputId}
          className="akili-content-search__input"
          type="search"
          maxLength={255}
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Nome do conteúdo"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              applyNow();
            }
          }}
        />
        <button
          type="button"
          className="akili-content-search__button"
          aria-label="Buscar conteúdos"
          onClick={applyNow}
        >
          <i className="fas fa-search" aria-hidden="true" />
        </button>
      </div>
      {children({
        materials: query.data ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        isSearchActive,
      })}
    </div>
  );
}
