import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, Award, BookOpen, CalendarDays, Sparkles } from "lucide-react";

import MemberCard from "@/components/kader/MemberCard";
import KaderPage from "@/components/kader/KaderPage";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { ensureMemberCard, getMemberDashboardData } from "@/lib/member/service";

export default async function KaderHomePage() {
  const session = await getServerSession(authOptions);
  const memberCard = await ensureMemberCard(session!.user.id);
  const data = await getMemberDashboardData(session!.user.id);
  const verificationUrl = `/verifikasi/kartu/${memberCard.id}`;

  return (
    <KaderPage
      eyebrow="Beranda Kader"
      title={`Selamat berproses, Sahabat ${data.user?.name?.split(" ")[0] || "PMII"}.`}
      description="Portal personal untuk identitas kader, learning journey, agenda, sertifikat, portofolio, dan riwayat organisasi."
    >
      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0 rounded-[1.5rem] bg-primary p-5 text-white shadow-[0_24px_70px_rgba(38,46,237,0.22)] md:rounded-[2rem] md:p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5CA0F]">Beranda Kader</p>
          <h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">
            Ruang tumbuh kader PMII Balikpapan
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/78 md:text-base">
            Pantau agenda, perjalanan belajar, sertifikat, dan portofolio personal dari satu dashboard yang ringan.
          </p>
        </div>
        <MemberCard user={data.user} verificationUrl={verificationUrl} compact />
      </section>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Status", value: data.profile?.status === "VERIFIED" ? "Aktif" : "Pending", icon: Sparkles },
          { label: "Progress Kaderisasi", value: `${data.progress.kaderisasi}%`, icon: Award },
          { label: "Learning", value: `${data.progress.learning}%`, icon: BookOpen },
          { label: "Agenda Terdekat", value: data.agendas.length.toString(), icon: CalendarDays },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="min-w-0 rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-sm md:p-5">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary/55">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-[#122562]">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <SectionCard title="Learning Journey" description="Jalur kaderisasi formal dan modul belajar yang sedang berjalan.">
          <div className="space-y-3">
            {data.learningPath.map((item) => (
              <Link key={item.title} href="/kader/learning" className="block rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-primary">{item.title}</p>
                    <p className="text-sm text-secondary/70">{item.description}</p>
                  </div>
                  <span className="text-sm font-black text-primary">{item.progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Agenda Terdekat" description="Agenda organisasi yang bisa diikuti kader.">
          <div className="space-y-3">
            {data.agendas.length === 0 ? (
              <p className="text-sm text-secondary/60">Belum ada agenda terdekat.</p>
            ) : (
              data.agendas.slice(0, 4).map((agenda) => (
                <Link key={agenda.title} href={agenda.href} className="flex items-center justify-between rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">
                  <div>
                    <p className="font-black text-primary">{agenda.title}</p>
                    <p className="text-sm text-secondary/70">{new Date(agenda.date).toLocaleDateString("id-ID")} · {agenda.location || "Lokasi menyusul"}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              ))
            )}
          </div>
        </SectionCard>
      </div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <SectionCard title="Sertifikat Terbaru" description="Arsip sertifikat terakhir yang tersimpan di dashboard kader.">
          <div className="space-y-3">
            {data.certificates.slice(0, 3).map((certificate) => (
              <Link key={certificate.id || certificate.title} href="/kader/sertifikat" className="block rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">
                <p className="font-black text-primary">{certificate.title}</p>
                <p className="mt-1 text-sm text-secondary/70">{certificate.category} · {certificate.status}</p>
              </Link>
            ))}
            {data.certificates.length === 0 && <p className="text-sm text-secondary/60">Belum ada sertifikat.</p>}
          </div>
        </SectionCard>

        <SectionCard title="Portofolio Terbaru" description="Karya, pengalaman, atau dokumen personal kader yang terakhir ditambahkan.">
          <div className="space-y-3">
            {data.portfolios.slice(0, 3).map((item) => (
              <Link key={item.id || item.title} href="/kader/portofolio" className="block rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">
                <p className="font-black text-primary">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-secondary/70">{item.type} · {item.description}</p>
              </Link>
            ))}
            {data.portfolios.length === 0 && <p className="text-sm text-secondary/60">Belum ada portofolio.</p>}
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Aksi Cepat" description="Akses cepat untuk aktivitas yang paling sering dipakai kader.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {data.quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`rounded-2xl px-4 py-3 text-center text-sm font-black transition active:scale-95 ${
                action.tone === "primary"
                  ? "bg-primary text-white"
                  : action.tone === "accent"
                    ? "bg-[#F5CA0F] text-secondary"
                    : "bg-blue-50 text-primary"
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </SectionCard>
    </KaderPage>
  );
}
