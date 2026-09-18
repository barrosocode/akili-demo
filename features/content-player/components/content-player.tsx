"use client";

import { StudentLessonPlayer } from "@/features/content-player/components/student-lesson-player";
import type { LearningSessionKind } from "@/types/student-learning";

type ContentPlayerProps = {
  contentUuid: string;
  readOnly?: boolean;
  childRef?: string;
  backHref?: string;
  studyTaskUuid?: string;
  sessionKind?: LearningSessionKind;
};

/**
 * Entrada pública do player — organização em abas (DefaultPreview).
 */
export function ContentPlayer(props: ContentPlayerProps) {
  return <StudentLessonPlayer {...props} />;
}
