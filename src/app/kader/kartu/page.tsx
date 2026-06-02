import { getServerSession } from "next-auth";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import MemberCardActions from "@/components/kader/MemberCardActions";
import MemberCard from "@/components/kader/MemberCard";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { ensureMemberCard, getMemberDashboardData } from "@/lib/member/service";

export default async function MemberDigitalCardPage() {
  const session = await getServerSession(authOptions);
  const memberCard = await ensureMemberCard(session!.user.id);
  const data = await getMemberDashboardData(session!.user.id);
  const verificationUrl = `/verifikasi/kartu/${memberCard.id}`;
  const cardStatus = data.profile?.status === "VERIFIED" ? "Aktif Terverifikasi" : "Menunggu Verifikasi";

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1fr]">
      <div className="space-y-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Kartu Anggota</p>
        <h1 className="text-3xl font-black text-[#122562]">Identitas digital kader</h1>
        <p className="text-secondary/70">
          Kartu anggota digital menampilkan data inti kader dan QR verifikasi.
          Download PNG, cetak PDF, atau bagikan link verifikasi publik.
        </p>
        <MemberCardActions
          name={data.user?.name || "Sahabat PMII"}
          noInduk={data.profile?.noInduk || "Belum tersedia"}
          komisariat={data.profile?.komisariat || "Komisariat belum diisi"}
          status={cardStatus}
          verificationUrl={verificationUrl}
        />
      </div>
      <div className="space-y-5">
        <MemberCard user={data.user} verificationUrl={verificationUrl} />
        <SectionCard title="Verifikasi QR" description="QR code/link kartu anggota sudah terhubung ke halaman verifikasi publik.">
          <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-700">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-bold">Status kartu: {cardStatus}</p>
          </div>
          <Link href={verificationUrl} className="mt-3 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-black text-white">
            Buka Halaman Verifikasi
          </Link>
        </SectionCard>
      </div>
    </div>
  );
}
