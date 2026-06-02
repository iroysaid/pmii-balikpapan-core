import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pmii-balikpapan.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, activities] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    prisma.activity.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/profil",
    "/berita",
    "/agenda",
    "/galeri",
    "/materi",
    "/kontak",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/berita/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
    url: `${siteUrl}/kegiatan/${activity.slug}`,
    lastModified: activity.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes, ...activityRoutes];
}
