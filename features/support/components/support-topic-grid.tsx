"use client";

import { SupportTopicCard } from "@/features/support/components/support-topic-card";
import type { SupportFaqTopicSummary } from "@/types/domain/support-faq";

type SupportTopicGridProps = {
  topics: SupportFaqTopicSummary[];
  onNavigate?: () => void;
};

export function SupportTopicGrid({ topics, onNavigate }: SupportTopicGridProps) {
  return (
    <div className="akili-support-grid" role="list">
      {topics.map((topic) => (
        <div key={topic.uuid} role="listitem">
          <SupportTopicCard topic={topic} onNavigate={onNavigate} />
        </div>
      ))}
    </div>
  );
}
