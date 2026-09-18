import { ContentPlayer } from "@/features/content-player/components/content-player";
import {
  parseSessionKindParam,
  parseStudyTaskUuidParam,
} from "@/lib/api/learning-session-query";

type StudentMaterialPageProps = {
  params: Promise<{ contentUuid: string }>;
  searchParams: Promise<{ studyTask?: string; kind?: string }>;
};

export default async function StudentMaterialPage({
  params,
  searchParams,
}: StudentMaterialPageProps) {
  const { contentUuid } = await params;
  const query = await searchParams;
  const studyTaskUuid = parseStudyTaskUuidParam(query.studyTask);
  const sessionKind = parseSessionKindParam(query.kind);

  return (
    <ContentPlayer
      contentUuid={contentUuid}
      backHref={studyTaskUuid ? "/aluno" : "/aluno/materiais"}
      studyTaskUuid={studyTaskUuid}
      sessionKind={sessionKind}
    />
  );
}
