import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, Award, BookOpen, CalendarDays, Sparkles } from "lucide-react";

import MemberCard from "@/components/kader/MemberCard";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { ensureMemberCard, getMemberDashboardData } from "@/lib/member/service";

export default async function KaderHomePage() {
  const session = await getServerSession(authOptions);
  const memberCard = await ensureMemberCard(session!.user.id);
  const data = await getMemberDashboardData(session!.user.id);
  const verificationUrl = `/verifikasi/kartu/${memberCard.id}`;

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-primary p-6 text-white shadow-[0_28px_90px_rgba(38,46,237,0.24)] md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F5CA0F]">Beranda Kader</p>
          <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
            Selamat berproses, Sahabat {data.user?.name?.split(" ")[0] || "PMII"}.
          </h1>
          <p className="mt-4 max-w-2xl text-white/78">
            Portal personal untuk identitas kader, learning journey, agenda, sertifikat,
            pencapaian, dan portofolio kader PMII Balikpapan.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`rounded-2xl px-4 py-3 text-center text-sm font-black transition active:scale-95 ${
                  action.tone === "primary"
                    ? "bg-white text-primary"
                    : action.tone === "accent"
                      ? "bg-[#F5CA0F] text-secondary"
                      : "bg-white/12 text-white"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <MemberCard user={data.user} verificationUrl={verificationUrl} compact />
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Status", value: data.profile?.status === "VERIFIED" ? "Aktif" : "Pending", icon: Sparkles },
          { label: "Progress Kaderisasi", value: `${data.progress.kaderisasi}%`, icon: Award },
          { label: "Learning", value: `${data.progress.learning}%`, icon: BookOpen },
          { label: "Agenda Terdekat", value: data.agendas.length.toString(), icon: CalendarDays },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/70 bg-white/82 p-5 shadow-sm">
              <Icon className="mb-4 h-6 w-6 text-primary" />
              <p className="text-xs font-black uppercase tracking-[0.14em] text-secondary/55">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-[#122562]">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
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
    </div>
  );
}
