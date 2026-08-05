import { Button } from "@/components/marketing/common/Button";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.cadastro);

export default function CadastroPage() {
  const { title, path } = marketingPageSeo.cadastro;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="space space-extra-bottom">
        <div className="container-style4 text-center">
          <h2 className="sec-title">Comece na Akili Educ</h2>
          <p className="mx-auto mb-4" style={{ maxWidth: "36rem" }}>
            Crie sua conta e acesse o método de estudo neurocientífico pensado para
            crianças e adolescentes — com acompanhamento familiar.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Button href="/checkout" variant="v4">
              Ir para o checkout
            </Button>
            <Button href="/preco-e-planos" variant="default">
              Ver planos
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
