import { getServerSession } from "next-auth";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

import { createMemberPortfolio, deleteMemberPortfolio } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);
  const portfolios = data.portfolios.slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Portofolio</p>
        <h1 className="mt-2 text-3xl font-black text-[#122562]">Ruang karya kader</h1>
        <p className="mt-2 max-w-2xl text-sm text-secondary/70">
          Simpan karya tulis, proposal, dokumentasi kegiatan, pengalaman organisasi, dan link karya.
        </p>
      </div>

      <SectionCard title="Portofolio Terbaru" description="Menampilkan maksimal 3 item terbaru agar mudah dipindai.">
        <details className="mb-4 rounded-2xl border border-dashed border-primary/25 bg-blue-50/70 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-primary">
            <span className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Portofolio
            </span>
            <span className="text-xs text-secondary/60">Buka form</span>
          </summary>

          <form action={createMemberPortfolio} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="title" required placeholder="Judul portofolio" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="type" placeholder="Kategori / tipe karya" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="issuedAt" type="date" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="externalUrl" placeholder="Link karya jika ada" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="file" type="file" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm md:col-span-2" />
            <textarea name="description" placeholder="Deskripsi/catatan singkat" rows={3} className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
            <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-black text-white md:w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Simpan Portofolio
            </button>
          </form>
        </details>

        <div className="space-y-3">
          {portfolios.length === 0 ? (
            <div className="rounded-2xl bg-blue-50 p-5 text-sm font-semibold text-secondary/70">
              Belum ada portofolio. Tambahkan karya atau pengalaman pertamamu.
            </div>
          ) : portfolios.map((item) => (
            <div key={item.id || item.title} className="flex min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{item.type}</p>
                <h2 className="mt-1 truncate text-lg font-black text-[#122562]">{item.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-secondary/70">{item.description}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {item.href && (
                  <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-primary">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Buka
                  </a>
                )}
                {item.id && (
                  <form action={deleteMemberPortfolio}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="inline-flex items-center rounded-full bg-red-50 px-3 py-2 text-xs font-black text-red-600">
                      <Trash2 className="mr-1 h-3 w-3" />
                      Hapus
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
