import { SupportFaqPage } from "@/features/support";

type PageProps = {
  params: Promise<{ topicUuid: string; faqUuid: string }>;
};

export const metadata = {
  title: "Artigo | Central de Ajuda",
  robots: { index: false, follow: false },
};

export default async function AlunoAjudaFaqPage({ params }: PageProps) {
  const { topicUuid, faqUuid } = await params;
  return <SupportFaqPage topicUuid={topicUuid} faqUuid={faqUuid} />;
}
