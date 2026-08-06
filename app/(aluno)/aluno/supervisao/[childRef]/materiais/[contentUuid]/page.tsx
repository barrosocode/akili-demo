import { ContentPlayer } from "@/features/content-player/components/content-player";

type PageProps = {
  params: Promise<{ childRef: string; contentUuid: string }>;
};

export default async function GuardianSupervisionMaterialPage({ params }: PageProps) {
  const { childRef, contentUuid } = await params;

  return (
    <ContentPlayer
      contentUuid={contentUuid}
      readOnly
      childRef={childRef}
      backHref={`/aluno/supervisao/${childRef}/materiais`}
    />
  );
}
