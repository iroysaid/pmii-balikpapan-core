import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pmii-balikpapan.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/profil", "/berita", "/agenda", "/galeri", "/materi"],
        disallow: ["/dashboard", "/kader", "/api", "/masuk", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
