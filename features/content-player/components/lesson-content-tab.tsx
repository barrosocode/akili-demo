"use client";

import { runActionScript } from "@/lib/content/run-action-script";
import type {
  ContentPage,
  ContentPageActionItem,
  PlaybackAction,
} from "@/types/student-learning";

type LessonContentTabProps = {
  pages: ContentPage[];
  actionsByUuid: Map<string, PlaybackAction>;
  onActionError: (message: string | null) => void;
  runningActionId: string | null;
  onRunningActionChange: (id: string | null) => void;
  readOnly?: boolean;
};

export function LessonContentTab({
  pages,
  actionsByUuid,
  onActionError,
  runningActionId,
  onRunningActionChange,
  readOnly = false,
}: LessonContentTabProps) {
  if (pages.length === 0) {
    return (
      <p className="lesson-player__empty">
        Este conteúdo não possui material didático.
      </p>
    );
  }

  async function handleActionClick(
    item: ContentPageActionItem,
    pageIndex: number
  ) {
    if (readOnly) return;

    const action = actionsByUuid.get(item.item);
    if (!action || !item.read_text) {
      onActionError("Action sem script ou texto para leitura.");
      return;
    }

    const actionKey = `${pageIndex}-${item.order}-${action.uuid}`;
    onActionError(null);
    onRunningActionChange(actionKey);

    try {
      await runActionScript(action.path, item.read_text);
    } catch (err) {
      onActionError(
        err instanceof Error ? err.message : "Falha ao executar a action."
      );
    } finally {
      onRunningActionChange(null);
    }
  }

  return (
    <div>
      {pages.map((page, pageIndex) => {
        const items = [...page.items].sort((a, b) => a.order - b.order);

        return (
          <article
            key={`${page.title}-${pageIndex}`}
            className="mb-4"
            style={{ marginBottom: pageIndex < pages.length - 1 ? 32 : 0 }}
          >
            {pageIndex === 0 && page.top_image ? (
              <figure className="lesson-player__figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={page.top_image} alt="" />
              </figure>
            ) : null}

            {pageIndex > 0 && page.title ? (
              <h2 className="lesson-player__section-title">{page.title}</h2>
            ) : null}

            {page.text ? (
              <div
                className="lesson-material mb-3"
                dangerouslySetInnerHTML={{ __html: page.text }}
              />
            ) : null}

            {items.map((item) => {
              if (item.type === "topic") {
                return (
                  <section
                    key={`topic-${pageIndex}-${item.order}`}
                    className="mb-4"
                  >
                    {item.title ? (
                      <h2 className="lesson-player__section-title">
                        {item.title}
                      </h2>
                    ) : null}
                    {item.image ? (
                      <figure className="lesson-player__figure">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" />
                      </figure>
                    ) : null}
                    {item.text ? (
                      <div
                        className="lesson-material"
                        dangerouslySetInnerHTML={{ __html: item.text }}
                      />
                    ) : null}
                  </section>
                );
              }

              const action = actionsByUuid.get(item.item);
              const actionKey = `${pageIndex}-${item.order}-${action?.uuid ?? "missing"}`;
              const isRunning = runningActionId === actionKey;

              return (
                <div
                  key={`action-${pageIndex}-${item.order}`}
                  className="lesson-player__action-row"
                >
                  <button
                    type="button"
                    className="vs-btn"
                    disabled={readOnly || !action || isRunning}
                    onClick={() => void handleActionClick(item, pageIndex)}
                  >
                    {isRunning
                      ? "Lendo..."
                      : item.action_text || action?.name || "Ouvir"}
                  </button>
                </div>
              );
            })}
          </article>
        );
      })}
    </div>
  );
}
