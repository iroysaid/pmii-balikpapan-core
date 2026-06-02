import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";

import ProfileContentEditor from "@/components/dashboard/ProfileContentEditor";
import { authOptions } from "@/lib/auth";
import {
  getProfileContent,
  getProfileContentFilePath,
} from "@/lib/profile/service";

export default async function DashboardProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/masuk?callbackUrl=/dashboard/profil");
  }

  const content = await getProfileContent();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-primary">
            CMS Internal
          </p>
          <h1 className="text-2xl font-bold text-primary">Kelola Profil</h1>
          <p className="mt-2 max-w-2xl text-secondary">
            CMS Profil hanya mengatur konten statis halaman profil organisasi:
            narasi, sejarah, struktur, nilai, gambar, dan sekretariat.
          </p>
        </div>
        <Link
          href="/profil"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-primary/90"
        >
          <Eye className="mr-2 h-4 w-4" />
          Lihat Profil
        </Link>
      </div>

      <ProfileContentEditor
        initialContent={content}
        contentFilePath={getProfileContentFilePath()}
      />
    </div>
  );
}
