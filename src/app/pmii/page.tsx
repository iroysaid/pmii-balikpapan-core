import type { Metadata } from "next";

import { Component as Hero } from "@/components/ui/hero";
import Team from "@/components/ui/team";
import ExpandableGallery from "@/components/ui/expandable-gallery";
import { TextParallaxContentExample } from "@/components/ui/text-parallax-content-scroll";

export const metadata: Metadata = {
  title: "Landing Page PMII Balikpapan",
  description:
    "Halaman muka baru PC PMII Kota Balikpapan dengan hero, pengurus, galeri, dan parallax story.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Team />
      <ExpandableGallery />
      <TextParallaxContentExample />
    </div>
  );
}
