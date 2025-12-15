import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested (Design System)
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PC PMII BALIKPAPAN",
  description: "Website Resmi Pengurus Cabang Pergerakan Mahasiswa Islam Indonesia Kota Balikpapan",
  icons: {
    icon: "/PMII.png", // Using the provided logo as favicon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={clsx(inter.variable, "font-sans flex flex-col min-h-screen")}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
