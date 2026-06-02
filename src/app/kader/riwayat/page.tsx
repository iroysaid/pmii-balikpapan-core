import { getServerSession } from "next-auth";
import { Plus, Trash2 } from "lucide-react";
import { createMemberOrganizationHistory, deleteMemberOrganizationHistory } from "@/app/actions/member";
import KaderPage from "@/components/kader/KaderPage";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function OrganizationHistoryPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <KaderPage
      eyebrow="Riwayat Organisasi"
      title="Timeline perjalanan organisasi"
      description="Catat jabatan, kegiatan, dan proses kaderisasi organisasi dalam satu timeline personal."
    >
      <SectionCard title="Tambah Riwayat" description="Tambahkan pengalaman organisasi yang penting dan relevan.">
        <details className="rounded-2xl border border-dashed border-primary/25 bg-blue-50/70 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-primary">
            <span className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Riwayat Organisasi
            </span>
            <span className="text-xs text-secondary/60">Buka form</span>
          </summary>
          <form action={createMemberOrganizationHistory} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="year" required placeholder="Tahun" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="level" placeholder="Tingkat: Komisariat/Cabang/Rayon" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="organizationName" placeholder="Nama organisasi/unit" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="role" required placeholder="Jabatan/peran" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="activity" placeholder="Kegiatan terkait" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
            <textarea name="description" placeholder="Keterangan" rows={3} className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-black text-white md:w-fit">Simpan Riwayat</button>
          </form>
        </details>
      </SectionCard>

      <SectionCard title="Timeline" description="Riwayat terbaru berada di bagian atas.">
        <div className="relative space-y-4 before:absolute before:bottom-0 before:left-3 before:top-1 before:w-px before:bg-blue-100 md:before:left-4">
          {data.histories.length === 0 ? (
            <div className="ml-8 rounded-2xl bg-blue-50 p-5 text-sm font-semibold text-secondary/70">
              Riwayat organisasi belum diisi.
            </div>
          ) : (
            data.histories.map((history) => (
              <div key={history.id || `${history.year}-${history.role}`} className="relative min-w-0 pl-8 md:pl-10">
                <span className="absolute left-0 top-4 h-6 w-6 rounded-full border-4 border-white bg-primary shadow-sm md:h-8 md:w-8" />
                <div className="min-w-0 rounded-2xl bg-blue-50 p-4 md:p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{history.year} · {history.level}</p>
                  <h2 className="mt-2 text-lg font-black text-[#122562] md:text-xl">{history.role}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-secondary/70">{history.description}</p>
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
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </KaderPage>
  );
}
