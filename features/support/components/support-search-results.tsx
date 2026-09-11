"use client";

import Link from "next/link";
import { SUPPORT_PATHS } from "@/features/support/lib/paths";
import type { SupportFaqSearchHit } from "@/types/domain/support-faq";

type SupportSearchResultsProps = {
  query: string;
  hits: SupportFaqSearchHit[];
  onNavigate?: () => void;
};

function groupByTopic(hits: SupportFaqSearchHit[]) {
  const groups = new Map<
    string,
    { topicUuid: string; topicName: string; items: SupportFaqSearchHit[] }
  >();

  for (const hit of hits) {
    const key = hit.topic.uuid;
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(hit);
    } else {
      groups.set(key, {
        topicUuid: hit.topic.uuid,
        topicName: hit.topic.name,
        items: [hit],
      });
    }
  }

  return Array.from(groups.values());
}

export function SupportSearchResults({
  query,
  hits,
  onNavigate,
}: SupportSearchResultsProps) {
  if (hits.length === 0) {
    return (
      <div className="akili-support-empty" role="status">
        <p>Não encontramos uma resposta para sua dúvida.</p>
        <p className="akili-support-empty__hint">
          Tente utilizar outros termos ou fale com o suporte.
        </p>
        <button type="button" className="vs-btn style3" disabled title="Em breve">
          Falar com suporte (em breve)
        </button>
      </div>
    );
  }

  const groups = groupByTopic(hits);

  return (
    <div className="akili-support-search-results">
      <p className="akili-support-search-results__label">
        Resultados para: <strong>&ldquo;{query}&rdquo;</strong>
      </p>
      {groups.map((group) => (
        <div key={group.topicUuid} className="akili-support-search-group">
          <h3 className="akili-support-search-group__title">
            <Link href={SUPPORT_PATHS.topic(group.topicUuid)} onClick={onNavigate}>
              {group.topicName}
            </Link>
          </h3>
          <ul className="akili-support-search-group__list">
            {group.items.map((hit) => (
              <li key={hit.uuid}>
                <Link
                  href={SUPPORT_PATHS.faq(group.topicUuid, hit.uuid)}
                  onClick={onNavigate}
                >
                  {hit.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
