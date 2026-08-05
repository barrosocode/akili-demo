import dynamic from "next/dynamic";

import { Button } from "@/components/marketing/common/Button";
import { SectionTitle } from "@/components/marketing/common/SectionTitle";
import { BlogCard } from "@/components/marketing/home/BlogCard";
import { blogPosts, blogSectionMeta } from "@/constants/blog";
import type { BlogPostCard } from "@/types/marketing";

const BlogCarousel = dynamic(
  () =>
    import("@/components/marketing/home/BlogCarousel").then(
      (mod) => mod.BlogCarousel,
    ),
  {
    loading: () => (
      <div className="row" aria-busy="true" aria-label="Carregando publicações">
        {blogPosts.slice(0, 3).map((post) => (
          <div key={post.href} className="col-lg-4 col-md-6 col-sm-12">
            <BlogCard post={post} />
          </div>
        ))}
      </div>
    ),
  },
);

type BlogPreviewProps = {
  posts?: BlogPostCard[];
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Preview do blog na home (MARKETING-038 / MARKETING-060).
 * Server wrapper — carousel via dynamic import.
 */
export function BlogPreview({
  posts = blogPosts,
  title = blogSectionMeta.title,
  subtitle = blogSectionMeta.subtitle,
  ctaLabel = blogSectionMeta.ctaLabel,
  ctaHref = blogSectionMeta.ctaHref,
}: BlogPreviewProps) {
  return (
    <section className="blog-style5 space" aria-label={title}>
      <div className="container-style4">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          className="blog5"
        />
        <BlogCarousel label={title}>
          {posts.map((post) => (
            <div key={post.href} className="marketing-blog-carousel__slide">
              <BlogCard post={post} />
            </div>
          ))}
        </BlogCarousel>
        <div className="blog-btn5 text-center">
          <Button href={ctaHref} variant="default" className="reg-btn blog5">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
