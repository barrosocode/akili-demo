"use client";

import Link from "next/link";
import { SupportBreadcrumb } from "@/features/support/components/support-breadcrumb";
import { SupportFaqActions } from "@/features/support/components/support-faq-actions";
import { SupportFaqBody } from "@/features/support/components/support-faq-body";
import { SupportStateMessage } from "@/features/support/components/support-state-message";
import { SUPPORT_PATHS } from "@/features/support/lib/paths";
import { useSupportFaqQuery } from "@/services/queries/support.queries";

type SupportFaqPageProps = {
  topicUuid: string;
  faqUuid: string;
};

export function SupportFaqPage({ topicUuid, faqUuid }: SupportFaqPageProps) {
  const { data, isLoading, isError, error, refetch } = useSupportFaqQuery(faqUuid);

  if (isLoading) {
    return (
      <div className="akili-support-page">
        <SupportStateMessage variant="loading" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="akili-support-page">
        <SupportStateMessage
          variant="error"
          error={error}
          onRetry={() => void refetch()}
        />
        <p className="mt-3">
          <Link href={SUPPORT_PATHS.topic(topicUuid)}>Voltar ao tópico</Link>
        </p>
      </div>
    );
  }

  const topicHref = SUPPORT_PATHS.topic(data.topic.uuid);

  return (
    <article className="akili-support-page">
      <SupportBreadcrumb
        items={[
          { label: data.topic.name, href: topicHref },
          { label: data.title },
        ]}
      />

      <header className="akili-support-article-header">
        <h1 className="akili-support-article-header__title">{data.title}</h1>
      </header>

      <SupportFaqBody html={data.body} />

      <hr className="akili-support-divider" />

      <SupportFaqActions actions={data.actions} />

      <p className="mt-4">
        <Link href={topicHref}>← Voltar para {data.topic.name}</Link>
      </p>
    </article>
  );
}
