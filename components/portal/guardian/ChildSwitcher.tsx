"use client";

import { useSession } from "@/providers/session-provider";

/**
 * Seletor rápido do filho ativo no portal do responsável.
 */
export function ChildSwitcher() {
  const { user, activeChildRef, setActiveChildRef } = useSession();
  const children = user?.children ?? [];

  if (children.length <= 1) return null;

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Filho ativo</h3>
      <label htmlFor="active-child" className="visually-hidden">
        Selecionar filho
      </label>
      <select
        id="active-child"
        className="form-control"
        value={activeChildRef ?? ""}
        onChange={(event) => setActiveChildRef(event.target.value || null)}
      >
        {children.map((child) => (
          <option key={child.ref} value={child.ref}>
            {child.name}
            {child.classroomName ? ` — ${child.classroomName}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
