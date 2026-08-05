import Image from "next/image";
import Link from "next/link";

import type { BlogPostCard } from "@/types/marketing";

type BlogCardProps = {
  post: BlogPostCard;
};

/**
 * Card de post do marketing (MARKETING-036).
 * Server Component — tipado `BlogPostCard`, sem UUID.
 */
export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="blog-card-five">
      <div className="blog-img-five">
        <Link href={post.href}>
          <Image
            src={post.imageSrc}
            alt={post.imageAlt}
            width={410}
            height={300}
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
        </Link>
        {post.dateLabel ? (
          <ul className="blog-meta-five">
            <li>
              <time dateTime={post.dateLabel}>{post.dateLabel}</time>
            </li>
          </ul>
        ) : null}
      </div>
      <div className="blog-content5">
        <h3 className="title">
          <Link href={post.href}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
      </div>
    </article>
  );
}
