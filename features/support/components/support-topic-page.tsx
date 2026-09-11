"use client";

import Link from "next/link";
import { SupportBreadcrumb } from "@/features/support/components/support-breadcrumb";
import { SupportStateMessage } from "@/features/support/components/support-state-message";
import { SUPPORT_PATHS } from "@/features/support/lib/paths";
import { useSupportTopicQuery } from "@/services/queries/support.queries";

type SupportTopicPageProps = {
  topicUuid: string;
};

export function SupportTopicPage({ topicUuid }: SupportTopicPageProps) {
  const { data, isLoading, isError, error, refetch } = useSupportTopicQuery(topicUuid);

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
          <Link href={SUPPORT_PATHS.home}>Voltar à Central de Ajuda</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="akili-support-page">
      <SupportBreadcrumb items={[{ label: data.name }]} />

      <header className="akili-support-article-header">
        <h1 className="akili-support-article-header__title">{data.name}</h1>
        {data.description && (
          <p className="akili-support-article-header__desc">{data.description}</p>
        )}
      </header>

      <hr className="akili-support-divider" />

      {data.faqs.length === 0 ? (
        <SupportStateMessage
          variant="empty"
          emptyMessage="Nenhum artigo publicado neste tópico."
        />
      ) : (
        <ul className="akili-support-faq-list">
          {data.faqs.map((faq) => (
            <li key={faq.uuid}>
              <Link href={SUPPORT_PATHS.faq(data.uuid, faq.uuid)}>{faq.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
