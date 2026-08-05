import Image from "next/image";

import type { StudyMethodStage } from "@/types/marketing";

type MethodStageCardProps = {
  stage: StudyMethodStage;
};

/**
 * Card de etapa do método (MARKETING-033).
 * Server Component — ícone + título + descrição (`activity-box`).
 */
export function MethodStageCard({ stage }: MethodStageCardProps) {
  return (
    <div className="activity-box">
      <div className="activity-icon">
        <Image
          src={stage.imageSrc}
          alt={stage.imageAlt}
          width={55}
          height={55}
        />
      </div>
      <div className="activity-content">
        <h3 className="title">{stage.title}</h3>
        <p>{stage.description}</p>
      </div>
    </div>
  );
}
