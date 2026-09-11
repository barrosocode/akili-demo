import { SupportTopicPage } from "@/features/support";

type PageProps = {
  params: Promise<{ topicUuid: string }>;
};

export const metadata = {
  title: "Tópico | Central de Ajuda",
  robots: { index: false, follow: false },
};

export default async function AjudaTopicPage({ params }: PageProps) {
  const { topicUuid } = await params;
  return <SupportTopicPage topicUuid={topicUuid} />;
}
