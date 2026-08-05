import { SectionTitle } from "@/components/marketing/common/SectionTitle";
import { MethodStageCard } from "@/components/marketing/home/MethodStageCard";
import { homeStudyMethodContent } from "@/constants/home-content";
import type { StudyMethodContent } from "@/types/marketing";

type StudyMethodProps = {
  content?: StudyMethodContent;
};

/**
 * Método neurocientífico + etapas (MARKETING-033 / metodo-de-estudosView.php).
 * Server Component — conteúdo estruturado (sem dangerouslySetInnerHTML).
 *
 * Usa `col-lg-4` (não `col-xl-4`) para não acionar o hide do tema em
 * `.activities-style1 .row .col-xl-4:nth-child(2)` no tablet.
 */
export function StudyMethod({ content = homeStudyMethodContent }: StudyMethodProps) {
  return (
    <>
      <section className="activities-style1" aria-label={content.methodTitle}>
        <div className="container-style4">
          <SectionTitle title={content.methodTitle} className="active" />
          <p className="text-center mx-auto" style={{ maxWidth: "52rem" }}>
            {content.methodBody}
          </p>
        </div>
      </section>

      <section className="activities-style1 mt-5" aria-label={content.stagesTitle}>
        <div className="container-style4">
          <SectionTitle title={content.stagesTitle} className="active" />
          <div className="row">
            {content.stages.map((stage) => (
              <div key={stage.id} className="col-lg-4 col-md-6 col-sm-12">
                <MethodStageCard stage={stage} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
