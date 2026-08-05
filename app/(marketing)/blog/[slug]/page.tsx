import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { blogPostDetails, getBlogPostBySlug } from "@/constants/blog";
import { buildPageMetadata } from "@/constants/seo";
import { siteConfig } from "@/constants/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPostDetails.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return { title: "Publicação" };
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.href,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        title={post.title}
        path={post.href}
        parent={{ label: "Blog", href: "/blog" }}
      />
      <Breadcrumb
        title={post.title}
        parent={{ label: "Blog", href: "/blog" }}
      />
      <section className="blog-details-area space space-extra-bottom">
        <div className="container-style4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className="blog-content">
                <div className="blog-img mb-4">
                  <Image
                    src={post.imageSrc}
                    alt={post.imageAlt}
                    width={820}
                    height={480}
                    className="w-100"
                    sizes="(max-width: 991px) 100vw, 720px"
                    priority
                  />
                </div>
                {post.dateLabel ? (
                  <p className="blog-meta mb-3">
                    <time dateTime={post.dateIso ?? undefined}>
                      {post.dateLabel}
                    </time>
                    {" · "}
                    {siteConfig.brand.name}
                  </p>
                ) : null}
                <h1 className="blog-title mb-4">{post.title}</h1>
                {post.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
                <p className="mt-4">
                  <Link href="/blog" className="vs-btn">
                    Voltar ao blog
                  </Link>
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
