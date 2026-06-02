import { getServerSession } from "next-auth";
import { ExternalLink, Plus, Trash2, Upload } from "lucide-react";

import { createMemberCertificate, deleteMemberCertificate } from "@/app/actions/member";
import KaderPage from "@/components/kader/KaderPage";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);
  const certificates = data.certificates.slice(0, 3);

  return (
    <KaderPage
      eyebrow="Sertifikat"
      title="Arsip sertifikat saya"
      description="Simpan sertifikat kaderisasi, agenda, learning, dan dokumen pendukung lain secara rapi."
    >
      <SectionCard title="Sertifikat Terbaru" description="Menampilkan maksimal 3 sertifikat terbaru agar halaman tetap ringan.">
        <details className="mb-4 rounded-2xl border border-dashed border-primary/25 bg-blue-50/70 p-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-black text-primary">
            <span className="inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Sertifikat
            </span>
            <span className="text-xs text-secondary/60">Buka form</span>
          </summary>

          <form action={createMemberCertificate} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="title" required placeholder="Judul sertifikat" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="category" placeholder="Kategori" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="issuer" placeholder="Penerbit" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="issuedAt" type="date" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
            <input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm md:col-span-2" />
            <textarea name="note" rows={3} placeholder="Deskripsi/catatan singkat" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none md:col-span-2" />
            <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-black text-white md:w-fit">
              <Upload className="mr-2 h-4 w-4" />
              Simpan Sertifikat
            </button>
          </form>
        </details>

        <div className="space-y-3">
          {certificates.length === 0 ? (
            <div className="rounded-2xl bg-blue-50 p-5 text-sm font-semibold text-secondary/70">
              Belum ada sertifikat. Gunakan tombol tambah untuk mulai mengarsipkan.
            </div>
          ) : certificates.map((certificate) => (
            <div key={certificate.id || certificate.title} className="flex min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="truncate font-black text-primary">{certificate.title}</p>
                <p className="text-sm text-secondary/70">
                  {certificate.category} · {certificate.issuer} · {new Date(certificate.date).toLocaleDateString("id-ID")}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                  {certificate.status}
                </span>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {certificate.fileUrl && (
                  <a href={certificate.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-primary">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Preview
                  </a>
                )}
                {certificate.id && (
                  <form action={deleteMemberCertificate}>
                    <input type="hidden" name="id" value={certificate.id} />
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
    </KaderPage>
  );
}
