import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";

import LandingContentEditor, {
  type EditableLandingSection,
} from "@/components/dashboard/LandingContentEditor";
import { authOptions } from "@/lib/auth";
import {
  getLandingContent,
  getLandingContentFilePath,
} from "@/lib/landing/service";

const editableSections = [
  {
    key: "hero",
    label: "Hero Section",
    fields: "headline, tagline, deskripsi, CTA, floating image, background",
  },
  {
    key: "visionMission",
    label: "Visi Misi",
    fields: "judul, visi, daftar misi, urutan misi",
  },
  {
    key: "ndp",
    label: "Nilai Dasar Pergerakan",
    fields: "judul section, deskripsi, card, urutan card",
  },
  {
    key: "team",
    label: "Section Pengurus",
    fields: "eyebrow, judul, deskripsi section. Data anggota pengurus dikelola dari menu Pengurus.",
  },
  {
    key: "documentation",
    label: "Dokumentasi",
    fields: "foto, alt, caption, CTA, link galeri",
  },
  {
    key: "movement",
    label: "Storytelling",
    fields: "Kaderisasi/Gerakan/Solidaritas, background, overlay, urutan",
  },
  {
    key: "finalCta",
    label: "CTA Penutup",
    fields: "headline, deskripsi, button, background visual",
  },
] satisfies EditableLandingSection[];

export default async function DashboardLandingPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/masuk?callbackUrl=/dashboard/landing");
  }

  const params = await searchParams;
  const content = await getLandingContent();
  const activeSection = editableSections.find(
    (section) => section.key === params.section
  ) || editableSections[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
            CMS Internal
          </p>
          <h1 className="text-2xl font-bold text-primary">
            Kelola Homepage
          </h1>
          <p className="mt-2 max-w-2xl text-secondary">
            CMS Homepage hanya mengatur konten statis dan profilisasi landing:
            hero, visi misi, NDP, dokumentasi, storytelling, dan CTA. Berita,
            agenda, galeri, dan e-learning tetap berasal dari modul dinamis.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-primary/90"
        >
          <Eye className="mr-2 h-4 w-4" />
          Lihat Website
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {editableSections.map((section) => (
          <Link
            key={section.key}
            href={`/dashboard/landing?section=${section.key}`}
            className={`rounded-xl border p-4 shadow-sm transition ${
              activeSection.key === section.key
                ? "border-primary bg-blue-50"
                : "border-gray-100 bg-white hover:border-primary/30 hover:bg-blue-50/40"
            }`}
          >
            <p className="text-sm font-bold text-primary">{section.label}</p>
            <p className="mt-1 text-xs text-secondary">
              {section.fields}
            </p>
          </Link>
        ))}
      </div>

      <LandingContentEditor
        initialContent={content}
        sections={editableSections}
        initialSectionKey={activeSection.key}
        contentFilePath={getLandingContentFilePath()}
      />
    </div>
  );
}
