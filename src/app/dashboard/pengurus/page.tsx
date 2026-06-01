import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";

import TeamMembersEditor from "@/components/dashboard/TeamMembersEditor";
import { authOptions } from "@/lib/auth";
import { getLandingContent } from "@/lib/landing/service";

export default async function DashboardPengurusPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/masuk?callbackUrl=/dashboard/pengurus");
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  const content = await getLandingContent();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
            Modul Dinamis
          </p>
          <h1 className="text-2xl font-bold text-primary">Kelola Pengurus</h1>
          <p className="mt-2 max-w-2xl text-secondary">
            Data pengurus dikelola sebagai modul tersendiri, lalu dapat
            ditampilkan di homepage dan halaman profil melalui pilihan
            visibilitas tiap orang.
          </p>
        </div>
        <Link
          href="/#profil"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-primary/90"
        >
          <Eye className="mr-2 h-4 w-4" />
          Lihat Section
        </Link>
      </div>

      <TeamMembersEditor initialMembers={content.team.members} />
    </div>
  );
}
