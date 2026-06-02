import { getServerSession } from "next-auth";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import MemberCard from "@/components/kader/MemberCard";
import MemberCardActions from "@/components/kader/MemberCardActions";
import KaderProfileForm from "@/components/kader/KaderProfileForm";
import KaderPage from "@/components/kader/KaderPage";
import { authOptions } from "@/lib/auth";
import { ensureMemberCard } from "@/lib/member/service";
import { prisma } from "@/lib/prisma";

export default async function KaderProfilePage() {
  const session = await getServerSession(authOptions);
  const [user, memberCard] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session!.user.id },
      include: { kaderProfile: true },
    }),
    ensureMemberCard(session!.user.id),
  ]);

  const verificationUrl = `/verifikasi/kartu/${memberCard.id}`;
  const cardStatus = user?.kaderProfile?.status === "VERIFIED" ? "Aktif Terverifikasi" : "Menunggu Verifikasi";

  return (
    <KaderPage
      eyebrow="Profil Kader"
      title="Identitas dan data personal"
      description="Kartu anggota digital dan data diri kader berada di satu tempat. Lengkapi profil agar learning journey, agenda, sertifikat, dan portofolio lebih akurat."
    >
      {user && (
        <div className="grid min-w-0 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 space-y-4">
            <div className="relative">
              <MemberCard user={user} verificationUrl={verificationUrl} />
              <div className="mt-3 flex justify-end sm:absolute sm:bottom-4 sm:right-28 sm:z-20 sm:mt-0">
                <MemberCardActions
                  compact
                  name={user.name || "Sahabat PMII"}
                  noInduk={user.kaderProfile?.noInduk || "Belum tersedia"}
                  komisariat={user.kaderProfile?.komisariat || "Komisariat belum diisi"}
                  status={cardStatus}
                  verificationUrl={verificationUrl}
                />
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-sm">
              <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-black">Status kartu: {cardStatus}</p>
                  <p className="text-xs font-semibold text-green-700/75">QR verifikasi publik sudah tersedia.</p>
                </div>
              </div>
              <Link href={verificationUrl} className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-black text-white">
                Buka Verifikasi
              </Link>
            </div>
          </div>
          <div className="min-w-0">
            <KaderProfileForm user={user} />
          </div>
        </div>
      )}
    </KaderPage>
  );
}
