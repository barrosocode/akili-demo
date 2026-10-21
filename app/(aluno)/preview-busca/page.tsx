"use client";

import { AlunoDashboardShell } from "@/components/portal/aluno/AlunoDashboardShell";
import { StudentContentSearch } from "@/features/student/components/student-content-search";

export default function ContentSearchPreviewPage() {
  return (
    <AlunoDashboardShell activeHref="/aluno/materiais">
      <div className="blog-content">
        <h2 className="blog-title">Materiais</h2>
        <p className="mb-4">Conteúdos liberados para o seu estudo.</p>
        <StudentContentSearch>{() => null}</StudentContentSearch>
      </div>
    </AlunoDashboardShell>
  );
}
