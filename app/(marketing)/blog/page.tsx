import { BlogCard } from "@/components/marketing/home/BlogCard";
import { Breadcrumb } from "@/components/marketing/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/marketing/seo/BreadcrumbJsonLd";
import { blogPosts } from "@/constants/blog";
import { buildPageMetadata, marketingPageSeo } from "@/constants/seo";

export const metadata = buildPageMetadata(marketingPageSeo.blog);

export default function BlogPage() {
  const { title, path } = marketingPageSeo.blog;

  return (
    <>
      <BreadcrumbJsonLd title={title} path={path} />
      <Breadcrumb title={title} />
      <section className="blog-style5 space space-extra-bottom">
        <div className="container-style4">
          {blogPosts.length === 0 ? (
            <p className="text-center">Em breve novas publicações.</p>
          ) : (
            <div className="row">
              {blogPosts.map((post) => (
                <div key={post.href} className="col-lg-4 col-md-6 col-sm-12">
                  <BlogCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
