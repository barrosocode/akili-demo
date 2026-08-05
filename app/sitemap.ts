import type { MetadataRoute } from "next";

import { blogPostDetails } from "@/constants/blog";
import { siteConfig } from "@/constants/site";

/**
 * Sitemap marketing (MARKETING-052).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;

  const entries: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/preco-e-planos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/cadastro", priority: 0.9, changeFrequency: "monthly" },
    { path: "/sobre-nos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    ...blogPostDetails.map((post) => ({
      path: post.href,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    { path: "/series", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.5, changeFrequency: "yearly" },
    { path: "/newsletter", priority: 0.5, changeFrequency: "monthly" },
  ];

  return entries.map(({ path, priority, changeFrequency }) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
