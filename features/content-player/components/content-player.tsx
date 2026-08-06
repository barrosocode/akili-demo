"use client";

import { StudentLessonPlayer } from "@/features/content-player/components/student-lesson-player";

type ContentPlayerProps = {
  contentUuid: string;
  readOnly?: boolean;
  childRef?: string;
  backHref?: string;
};

/**
 * Entrada pública do player — organização em abas (DefaultPreview).
 */
export function ContentPlayer(props: ContentPlayerProps) {
  return <StudentLessonPlayer {...props} />;
}
