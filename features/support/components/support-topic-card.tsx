"use client";

import Link from "next/link";
import { useSupportPaths } from "@/features/support/lib/use-support-paths";
import type { SupportFaqTopicSummary } from "@/types/domain/support-faq";

type SupportTopicCardProps = {
  topic: SupportFaqTopicSummary;
  onNavigate?: () => void;
};

export function SupportTopicCard({ topic, onNavigate }: SupportTopicCardProps) {
  const paths = useSupportPaths();
  return (
    <Link
      href={paths.topic(topic.uuid)}
      className="akili-support-card"
      onClick={onNavigate}
    >
      <h3 className="akili-support-card__title">{topic.name}</h3>
      {topic.description ? (
        <p className="akili-support-card__desc">{topic.description}</p>
      ) : (
        <p className="akili-support-card__desc akili-support-card__desc--muted">
          Saiba mais sobre este tópico.
        </p>
      )}
      {topic.faqs_count > 0 && (
        <span className="akili-support-card__meta">
          {topic.faqs_count} {topic.faqs_count === 1 ? "artigo" : "artigos"}
        </span>
      )}
    </Link>
  );
}
