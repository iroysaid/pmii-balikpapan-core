import { prisma } from "@/lib/prisma";
import KegiatanClient from "./KegiatanClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktivitas & Agenda | PMII Balikpapan",
  description: "Daftar kegiatan, agenda, dan dokumentasi PMII Cabang Balikpapan.",
};

export default async function KegiatanPage() {
  const activities = await prisma.activity.findMany({
    where: { published: true, scope: "PUBLIC" },
    orderBy: { startDate: "desc" },
    include: {
      photos: true,
      organization: true,
    },
  });

  return (
    <div className="bg-gray-50 min-h-screen">
        <KegiatanClient activities={activities} />
    </div>
  );
}
