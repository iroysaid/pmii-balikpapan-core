import Link from "next/link";
import { getServerSession } from "next-auth";

import { registerMemberAgenda } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function MyAgendaPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <SectionCard title="Agenda Saya" description="Agenda kader terhubung dengan agenda yang dibuat admin. Status peserta siap dikembangkan untuk verifikasi kehadiran dan sertifikat.">
      <div className="grid gap-3">
        {data.agendas.map((agenda) => (
          <div key={agenda.title} className="rounded-2xl border border-blue-100 bg-blue-50 p-4 transition hover:bg-blue-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Link href={agenda.href} className="font-black text-primary hover:underline">
                  {agenda.title}
                </Link>
                <p className="text-sm text-secondary/70">{new Date(agenda.date).toLocaleString("id-ID")} · {agenda.location || "Lokasi menyusul"}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-primary">
                  {agenda.status === "AVAILABLE" ? "Agenda tersedia" : agenda.status}
                </span>
                {agenda.status === "AVAILABLE" && agenda.id && (
                  <form action={registerMemberAgenda}>
                    <input type="hidden" name="activityId" value={agenda.id} />
                    <button className="rounded-full bg-primary px-4 py-2 text-xs font-black text-white" type="submit">
                      Ikuti
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
        {data.agendas.length === 0 && <p className="text-sm text-secondary/60">Belum ada agenda tersedia.</p>}
      </div>
    </SectionCard>
  );
}
