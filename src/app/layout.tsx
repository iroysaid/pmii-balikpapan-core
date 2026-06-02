import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested (Design System)
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";
import { getLandingContent } from "@/lib/landing/service";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pmii-balikpapan.org"),
  title: {
    default: "PMII Balikpapan",
    template: "%s | PMII Balikpapan",
  },
  description: "Website resmi PMII Balikpapan untuk profil organisasi, berita, agenda, galeri, kaderisasi digital, dan Learning Journey kader.",
  applicationName: "PMII Balikpapan",
  keywords: [
    "PMII Balikpapan",
    "Pergerakan Mahasiswa Islam Indonesia",
    "Kaderisasi PMII",
    "Learning Journey PMII",
    "Agenda PMII",
  ],
  authors: [{ name: "PMII Balikpapan" }],
  creator: "PMII Balikpapan",
  publisher: "PMII Balikpapan",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "PMII Balikpapan",
    title: "PMII Balikpapan",
    description: "Sistem digital PMII Balikpapan untuk organisasi, kader, agenda, berita, dan pembelajaran kader.",
    images: [
      {
        url: "/PMII_BPP.png",
        width: 1200,
        height: 630,
        alt: "PMII Balikpapan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PMII Balikpapan",
    description: "Sistem digital PMII Balikpapan untuk organisasi, kader, agenda, berita, dan pembelajaran kader.",
    images: ["/PMII_BPP.png"],
  },
  icons: {
    icon: "/favicon.png", // Using the provided logo as favicon
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const landingContent = await getLandingContent();

  return (
    <html lang="id">
      <body className={clsx(inter.variable, "font-sans flex flex-col min-h-screen")}>
        <Providers>
          <LayoutWrapper
            footer={landingContent.footer}
            navbar={landingContent.navbar}
          >
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
