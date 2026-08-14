import {format, isValid, parseISO} from "date-fns";
import {ptBR} from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

import type {BlogPostCard} from "@/types/marketing";

type BlogCardProps = {
    post: BlogPostCard;
};

function blogCardDateParts(dateIso?: string): {month: string; day: string} | null {
    if (!dateIso) {
        return null;
    }

    const date = parseISO(dateIso);
    if (!isValid(date)) {
        return null;
    }

    return {
        month: format(date, "MMM", {locale: ptBR}).replace(".", "").toUpperCase(),
        day: format(date, "dd"),
    };
}

/**
 * Card de post do marketing (MARKETING-036).
 * Server Component — tipado `BlogPostCard`, sem UUID.
 */
export function BlogCard({post}: BlogCardProps) {
    const dateParts = blogCardDateParts(post.dateIso);

    return (
        <article className="blog-card-five">
            <div className="blog-img-five">
                <Link href={post.href} className="blog-card-five__image-link">
                    <Image src={post.imageSrc} alt={post.imageAlt} width={410} height={300} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" />
                </Link>
            </div>
            <div className="blog-content5">
                <h3 className="title">
                    <Link href={post.href}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
                {dateParts ? (
                    <div className="blog-date5">
                        <span>{dateParts.month}</span>
                        <h4>
                            <time dateTime={post.dateIso}>{dateParts.day}</time>
                        </h4>
                    </div>
                ) : null}
            </div>
        </article>
    );
}
