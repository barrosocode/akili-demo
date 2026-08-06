"use client";

import Link from "next/link";

import { StudentMaterialsList } from "@/features/student/components/student-materials-list";
import { useGuardianSupervisionDashboardQuery } from "@/features/student/hooks/use-student-dashboard";

type SupervisionMaterialsPageProps = {
  childRef: string;
};

export function SupervisionMaterialsPage({ childRef }: SupervisionMaterialsPageProps) {
  const { data } = useGuardianSupervisionDashboardQuery(childRef);

  return (
    <div className="blog-content">
      <p className="mb-3">
        <Link href={`/aluno/supervisao/${childRef}`} className="vs-btn style3">
          Voltar ao ambiente
        </Link>
      </p>
      <h2 className="blog-title">Materiais</h2>
      <p className="mb-4">
        Visualização do ambiente de {data?.student?.name ?? "aluno"} (somente leitura).
      </p>
      <StudentMaterialsList
        materials={data?.materials}
        readOnly
        childRef={childRef}
      />
    </div>
  );
}
