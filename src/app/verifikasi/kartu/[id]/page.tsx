import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function VerifyMemberCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await prisma.memberCard.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          kaderProfile: true,
        },
      },
    },
  });

  if (!card) {
    notFound();
  }

  const isActive = card.status === "ACTIVE";
  const isVerified = card.user.kaderProfile?.status === "VERIFIED";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(38,46,237,0.18),transparent_32%),linear-gradient(180deg,#f8fbff,#eef4ff)] px-4 py-10 text-secondary">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-3 font-black text-primary">
          <Image src="/PMII_BPP.png" alt="Logo PMII Balikpapan" width={42} height={42} className="h-10 w-10 object-contain" />
          PMII Balikpapan
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(18,37,98,0.16)] backdrop-blur-2xl">
          <div className="bg-[#122562] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F5CA0F]">
              Verifikasi Kartu Anggota
            </p>
            <h1 className="mt-3 text-3xl font-black">
              {isActive && isVerified ? "Kartu valid dan aktif" : "Kartu perlu verifikasi lanjutan"}
            </h1>
          </div>

          <div className="space-y-5 p-6">
            <div className={`flex items-start gap-3 rounded-2xl p-4 ${
              isActive && isVerified ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
            }`}>
              {isActive && isVerified ? <CheckCircle2 className="mt-0.5 h-6 w-6" /> : <ShieldAlert className="mt-0.5 h-6 w-6" />}
              <div>
                <p className="font-black">
                  {isActive && isVerified ? "Identitas kader terverifikasi" : "Status belum sepenuhnya terverifikasi"}
                </p>
                <p className="mt-1 text-sm">
                  Halaman ini memverifikasi data kartu digital yang diterbitkan oleh sistem PMII Balikpapan.
                </p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl bg-blue-50 p-5 text-sm">
              <InfoRow label="Nama" value={card.user.name} />
              <InfoRow label="NIA" value={card.user.kaderProfile?.noInduk || "Belum tersedia"} />
              <InfoRow label="Komisariat" value={card.user.kaderProfile?.komisariat || "Belum diisi"} />
              <InfoRow label="Rayon" value={card.user.kaderProfile?.rayon || "-"} />
              <InfoRow label="Status Kartu" value={card.status} />
              <InfoRow label="Status Keanggotaan" value={card.user.kaderProfile?.status || "PENDING"} />
              <InfoRow label="Diterbitkan" value={card.issuedAt.toLocaleDateString("id-ID")} />
            </div>

            <p className="text-xs leading-relaxed text-secondary/60">
              Jika data tidak sesuai, hubungi pengurus PMII Balikpapan untuk pembaruan dan verifikasi ulang.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-blue-100 pb-2 last:border-0 last:pb-0">
      <span className="font-bold text-secondary/60">{label}</span>
      <span className="text-right font-black text-[#122562]">{value}</span>
    </div>
  );
}
