import { getServerSession } from "next-auth";
import KaderProfileForm from "@/components/kader/KaderProfileForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function KaderProfilePage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { kaderProfile: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Profil Kader</p>
        <h1 className="mt-2 text-3xl font-black text-[#122562]">Data personal anggota</h1>
        <p className="mt-2 max-w-2xl text-secondary/70">
          Profil ini milik kader, berbeda dari profil organisasi. Lengkapi agar kartu anggota,
          learning journey, dan arsip pencapaian lebih akurat.
        </p>
      </div>
      {user && <KaderProfileForm user={user} />}
    </div>
  );
}

