import Link from "next/link";
import KaderPage from "@/components/kader/KaderPage";
import SectionCard from "@/components/kader/SectionCard";

export default function KaderSettingsPage() {
  return (
    <KaderPage
      eyebrow="Pengaturan Akun"
      title="Preferensi dan keamanan"
      description="Kelola akses akun dan arah cepat untuk memperbarui identitas kader."
    >
      <SectionCard title="Akun" description="Pengaturan keamanan dan preferensi akun kader.">
        <div className="grid min-w-0 gap-3 md:grid-cols-2">
          <Link href="/ganti-password" className="rounded-2xl bg-blue-50 p-5 font-black text-primary transition hover:bg-blue-100">
            Ganti Password
          </Link>
          <Link href="/kader/profil" className="rounded-2xl bg-blue-50 p-5 font-black text-primary transition hover:bg-blue-100">
            Edit Profil Kader
          </Link>
        </div>
      </SectionCard>
    </KaderPage>
  );
}
