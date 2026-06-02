import { getServerSession } from "next-auth";
import { Trash2 } from "lucide-react";
import { createMemberOrganizationHistory, deleteMemberOrganizationHistory } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function OrganizationHistoryPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <SectionCard title="Riwayat Organisasi" description="Timeline jabatan, kegiatan, dan perjalanan organisasi kader.">
      <form action={createMemberOrganizationHistory} className="mb-4 grid gap-3 rounded-2xl bg-blue-50 p-5 md:grid-cols-2">
        <input name="year" required placeholder="Tahun" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="level" placeholder="Tingkat: Komisariat/Cabang/Rayon" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="organizationName" placeholder="Nama organisasi/unit" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="role" required placeholder="Jabatan/peran" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="activity" placeholder="Kegiatan terkait" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
        <textarea name="description" placeholder="Keterangan" rows={3} className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
        <button className="rounded-full bg-primary px-5 py-3 font-black text-white md:w-fit">Tambah Riwayat</button>
      </form>
      <div className="space-y-3">
        {data.histories.length === 0 ? (
          <p className="text-sm text-secondary/60">Riwayat organisasi belum diisi.</p>
        ) : (
          data.histories.map((history) => (
            <div key={history.id || `${history.year}-${history.role}`} className="rounded-2xl bg-blue-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{history.year} · {history.level}</p>
              <h2 className="mt-2 text-xl font-black text-[#122562]">{history.role}</h2>
              <p className="mt-2 text-sm text-secondary/70">{history.description}</p>
              {history.id && (
                <form action={deleteMemberOrganizationHistory} className="mt-4">
                  <input type="hidden" name="id" value={history.id} />
                  <button className="inline-flex items-center rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600">
                    <Trash2 className="mr-1 h-3 w-3" />
                    Hapus
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
