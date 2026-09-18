"use client";

import Link from "next/link";

import { StudyKanbanBoard } from "@/features/study-kanban/components/study-kanban-board";
import { useStudentStudyBoardQuery } from "@/features/study-board/hooks/use-student-study-board";
import {
  formatStudyCalendarDate,
  formatStudyWarningsCount,
} from "@/features/study-board/lib/format-study-date";
import { getUserFacingApiMessage } from "@/lib/api/errors";
import { BffClientError } from "@/services/bff/client";

export function StudentStudyBoardView() {
  const { data: board, isLoading, error } = useStudentStudyBoardQuery();

  if (isLoading && !board) {
    return (
      <div className="blog-content" role="status">
        <p>Carregando seu quadro de estudos...</p>
      </div>
    );
  }

  if (error && !board) {
    return (
      <div className="blog-content">
        <h2 className="blog-title">Estudos</h2>
        <p style={{ color: "red" }} role="alert">
          {error instanceof BffClientError
            ? (error.detail ?? error.title)
            : getUserFacingApiMessage(error)}
        </p>
      </div>
    );
  }

  if (!board) return null;

  const plan = board.current_study_plan;

  return (
    <div className="portal-dashboard-page">
      <div className="blog-content">
        <div className="portal-page-header">
          <h2 className="blog-title">{board.name}</h2>
        </div>

        {plan ? (
          <>
            <div className="widget mb-4">
              <h3 className="widget_title">Plano ativo</h3>
              <div className="d-flex flex-wrap gap-2" aria-label="Datas do plano">
                <span className="portal-chip">
                  Começa em {formatStudyCalendarDate(plan.starts_on)}
                </span>
                <span className="portal-chip">
                  Conteúdo até {formatStudyCalendarDate(plan.content_deadline_on)}
                </span>
                <span className="portal-chip portal-chip--muted">
                  {formatStudyWarningsCount(plan.warnings_count)}
                </span>
              </div>
            </div>
            <p className="mb-0">
              Toque em um card de Hoje ou Em estudo para começar. Ele muda de
              coluna sozinho.
            </p>
          </>
        ) : (
          <div className="widget mb-4" role="status">
            <h3 className="widget_title">Aguardando o plano</h3>
            <p>
              Seu responsável ainda não gerou o plano de estudos. Quando o roteiro
              estiver pronto, as atividades do dia aparecem nesta página.
            </p>
            <p className="mb-0">
              <Link href="/aluno/materiais" className="vs-btn style3">
                Ver materiais
              </Link>
            </p>
          </div>
        )}
      </div>

      {plan ? <StudyKanbanBoard /> : null}
    </div>
  );
}
