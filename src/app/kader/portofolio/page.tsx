import { getServerSession } from "next-auth";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { createMemberPortfolio, deleteMemberPortfolio } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <SectionCard title="Portofolio Kader" description="Ruang LinkedIn sederhana untuk sertifikat, piagam, karya tulis, proposal, dokumentasi, link karya, dan pengalaman organisasi.">
      <form action={createMemberPortfolio} className="mb-4 grid gap-3 rounded-2xl bg-blue-50 p-5 md:grid-cols-2">
        <input name="title" required placeholder="Judul karya/portofolio" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="type" placeholder="Jenis: Karya tulis, proposal, piagam..." className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
        <input name="externalUrl" placeholder="Link karya jika ada" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
        <textarea name="description" placeholder="Deskripsi singkat" rows={3} className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
        <input name="file" type="file" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm md:col-span-2" />
        <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-black text-white md:w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Portofolio
        </button>
      </form>
      <div className="grid gap-3 md:grid-cols-2">
        {data.portfolios.map((item) => (
          <div key={item.id || item.title} className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{item.type}</p>
            <h2 className="mt-2 text-xl font-black text-[#122562]">{item.title}</h2>
            <p className="mt-2 text-sm text-secondary/70">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.href && (
                <a href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-black text-primary">
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
  );
}
