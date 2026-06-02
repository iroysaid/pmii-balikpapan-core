import Image from "next/image";
import Link from "next/link";
import { QrCode } from "lucide-react";

export default function MemberCard({
  user,
  verificationUrl,
  compact = false,
}: {
  user: {
    name?: string | null;
    role?: string | null;
    isActive?: boolean | null;
    image?: string | null;
    kaderProfile?: {
      noInduk?: string | null;
      komisariat?: string | null;
      rayon?: string | null;
      status?: string | null;
    } | null;
  } | null;
  verificationUrl?: string;
  compact?: boolean;
}) {
  const profile = user?.kaderProfile;

  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-[#122562] p-5 text-white shadow-[0_28px_90px_rgba(18,37,98,0.34)] ${compact ? "" : "md:p-7"}`}>
      <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-[#F5CA0F]/25 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(38,46,237,0.42),transparent_55%)]" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F5CA0F]">
              Kartu Anggota Digital
            </p>
            <p className="mt-1 text-sm font-bold text-white/70">PC PMII Balikpapan</p>
          </div>
          <Image src="/PMII_BPP.png" alt="Logo PMII" width={44} height={44} className="h-11 w-11 object-contain" />
        </div>

        <div className="flex items-end gap-4">
          <div className="relative h-24 w-20 overflow-hidden rounded-2xl border border-white/25 bg-white/10">
            {user?.image ? (
              <Image src={user.image} alt={user.name || "Foto kader"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white/60">
                {(user?.name || "K").slice(0, 1)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-black">{user?.name || "Sahabat PMII"}</h2>
            <p className="mt-1 text-sm font-bold text-white/70">
              NIA: {profile?.noInduk || "Belum tersedia"}
            </p>
            <p className="text-sm text-white/70">{profile?.komisariat || "Komisariat belum diisi"}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-4">
          <div className="space-y-2 text-sm">
            <div className="rounded-full bg-white/10 px-3 py-2 font-bold">
              Status: {profile?.status === "VERIFIED" ? "Aktif Terverifikasi" : "Menunggu Verifikasi"}
            </div>
            <div className="rounded-full bg-white/10 px-3 py-2 font-bold">
              Akun: {user?.isActive === false ? "Nonaktif" : "Aktif"} · {(user?.role || "KADER").replace(/_/g, " ")}
            </div>
            <div className="rounded-full bg-white/10 px-3 py-2 font-bold">
              Rayon: {profile?.rayon || "-"}
            </div>
          </div>
          {verificationUrl ? (
            <Link
              href={verificationUrl}
              className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white text-center text-primary transition active:scale-95"
            >
              <QrCode className="h-9 w-9" />
              <span className="mt-1 text-[9px] font-black uppercase tracking-wide">
                Verify
              </span>
            </Link>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-primary">
              <QrCode className="h-12 w-12" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
