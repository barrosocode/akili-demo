"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { SCHOOL_WEEKDAYS } from "@/features/study-planner/lib/weekdays";
import type { CatalogSubject, WeekdayIso } from "@/types/guardian-study-planner";

export type SchoolScheduleSlotView = {
  id: string;
  index: number;
  weekday: WeekdayIso;
  subject_uuid: string;
};

type SchoolScheduleWeekProps = {
  subjects: CatalogSubject[];
  slots: SchoolScheduleSlotView[];
  subjectName: (subjectUuid: string) => string;
  onAdd: (weekday: WeekdayIso, subjectUuid: string) => void;
  onRemove: (index: number) => void;
};

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

function SubjectCombobox({
  dayLabel,
  subjects,
  onSelect,
}: {
  dayLabel: string;
  subjects: CatalogSubject[];
  onSelect: (subjectUuid: string) => void;
}) {
  const listId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return subjects;
    return subjects.filter((subject) => fold(subject.name).includes(needle));
  }, [query, subjects]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, subjects]);

  function choose(subject: CatalogSubject) {
    onSelect(subject.uuid);
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      if (suggestions.length === 0) return;
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      if (suggestions.length === 0) return;
      setActiveIndex(
        (current) => (current - 1 + suggestions.length) % suggestions.length
      );
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const subject = suggestions[activeIndex];
      if (open && subject) choose(subject);
    }
  }

  const activeSubject = open ? suggestions[activeIndex] : undefined;

  return (
    <div className="school-schedule-combo">
      <label className="visually-hidden" htmlFor={inputId}>
        Adicionar disciplina: {dayLabel}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={
          activeSubject ? `${listId}-${activeSubject.uuid}` : undefined
        }
        placeholder="Disciplina"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {open && suggestions.length > 0 ? (
        <ul id={listId} role="listbox" className="school-schedule-suggest">
          {suggestions.map((subject, index) => (
            <li key={subject.uuid} role="presentation">
              <button
                type="button"
                id={`${listId}-${subject.uuid}`}
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex
                    ? "school-schedule-suggest__item is-active"
                    : "school-schedule-suggest__item"
                }
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(subject)}
              >
                {subject.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open && subjects.length === 0 ? (
        <p className="school-schedule-suggest__empty" role="status">
          Todas as disciplinas deste dia já foram incluídas.
        </p>
      ) : null}
      {open && subjects.length > 0 && suggestions.length === 0 ? (
        <p className="school-schedule-suggest__empty" role="status">
          Nenhuma disciplina com esse nome.
        </p>
      ) : null}
    </div>
  );
}

export function SchoolScheduleWeek({
  subjects,
  slots,
  subjectName,
  onAdd,
  onRemove,
}: SchoolScheduleWeekProps) {
  if (subjects.length === 0 && slots.length === 0) {
    return (
      <p className="mb-0">
        Nenhuma disciplina cadastrada.
      </p>
    );
  }

  return (
    <div className="school-schedule-scroll">
      <table className="school-schedule-table">
        <thead>
          <tr>
            <th scope="col">Dia</th>
            <th scope="col">Disciplinas</th>
          </tr>
        </thead>
        <tbody>
          {SCHOOL_WEEKDAYS.map((day) => {
            const daySlots = slots.filter((slot) => slot.weekday === day.iso);
            const taken = new Set(daySlots.map((slot) => slot.subject_uuid));
            const available = subjects.filter(
              (subject) => !taken.has(subject.uuid)
            );

            return (
              <tr key={day.iso}>
                <th scope="row">{day.label}</th>
                <td>
                  <div className="school-schedule-subjects">
                    {daySlots.length > 0 ? (
                      <ul className="school-schedule-chips">
                        {daySlots.map((slot) => {
                          const name = subjectName(slot.subject_uuid);
                          return (
                            <li key={slot.id} className="school-schedule-chip">
                              <span>{name}</span>
                              <button
                                type="button"
                                aria-label={`Remover ${name} de ${day.label}`}
                                onClick={() => onRemove(slot.index)}
                              >
                                <span aria-hidden="true">×</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                    {subjects.length > 0 ? (
                      <SubjectCombobox
                        dayLabel={day.label}
                        subjects={available}
                        onSelect={(subjectUuid) => onAdd(day.iso, subjectUuid)}
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
