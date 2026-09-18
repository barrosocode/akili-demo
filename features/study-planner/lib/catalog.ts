import type { CatalogSubject, CatalogTopic } from "@/types/guardian-study-planner";
import type { StudentDashboard } from "@/types/student-learning";

export function catalogFromLearning(dashboard: StudentDashboard | undefined): {
  subjects: CatalogSubject[];
  topics: CatalogTopic[];
} {
  const subjects = new Map<string, CatalogSubject>();
  const topics = new Map<string, CatalogTopic>();

  for (const material of dashboard?.materials ?? []) {
    const subject = material.content.subject;
    const topic = material.content.topic;
    if (subject?.uuid && subject.name) {
      subjects.set(subject.uuid, { uuid: subject.uuid, name: subject.name });
    }
    if (topic?.uuid && topic.name) {
      topics.set(topic.uuid, {
        uuid: topic.uuid,
        name: topic.name,
        subjectName: subject?.name ?? null,
      });
    }
  }

  return {
    subjects: [...subjects.values()].sort((left, right) =>
      left.name.localeCompare(right.name, "pt-BR")
    ),
    topics: [...topics.values()].sort((left, right) =>
      left.name.localeCompare(right.name, "pt-BR")
    ),
  };
}
