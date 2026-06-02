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
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${getStatusClassName(agenda.status)}`}>
                  {getStatusLabel(agenda.status)}
                </span>
                {agenda.status === "AVAILABLE" && agenda.id && (
                  <form action={registerMemberAgenda}>
                    <input type="hidden" name="activityId" value={agenda.id} />
                    <button className="rounded-full bg-primary px-4 py-2 text-xs font-black text-white" type="submit">
                      Daftar
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

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    AVAILABLE: "Agenda tersedia",
    REGISTERED: "Terdaftar",
    PENDING: "Menunggu verifikasi",
    ACCEPTED: "Diterima",
    PRESENT: "Hadir",
    DONE: "Selesai",
    REJECTED: "Ditolak",
  };

  return labels[status] || status;
}

function getStatusClassName(status: string) {
  if (status === "AVAILABLE") return "bg-white text-primary";
  if (status === "PENDING") return "bg-amber-50 text-amber-700";
  if (status === "ACCEPTED") return "bg-blue-100 text-primary";
  if (status === "PRESENT" || status === "DONE") return "bg-green-50 text-green-700";
  if (status === "REJECTED") return "bg-red-50 text-red-600";
  return "bg-white text-secondary";
}
