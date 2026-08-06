import { ContentPlayer } from "@/features/content-player/components/content-player";

type StudentMaterialPageProps = {
  params: Promise<{ contentUuid: string }>;
};

export default async function StudentMaterialPage({ params }: StudentMaterialPageProps) {
  const { contentUuid } = await params;

  return (
    <ContentPlayer
      contentUuid={contentUuid}
      backHref="/aluno/materiais"
    />
  );
}
