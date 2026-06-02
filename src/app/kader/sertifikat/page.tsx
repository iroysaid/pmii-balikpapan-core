import { getServerSession } from "next-auth";
import { ExternalLink, Trash2, Upload } from "lucide-react";

import { createMemberCertificate, deleteMemberCertificate } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <div className="space-y-5">
      <SectionCard title="Sertifikat Saya" description="Sertifikat agenda, learning, kaderisasi, dan sertifikat upload mandiri kader.">
        <form action={createMemberCertificate} className="mb-4 grid gap-3 rounded-2xl border border-dashed border-primary/30 bg-blue-50 p-5 md:grid-cols-2">
          <input name="title" required placeholder="Judul sertifikat" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
          <input name="issuer" placeholder="Penerbit" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
          <input name="category" placeholder="Kategori" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
          <input name="issuedAt" type="date" className="rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
          <input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm md:col-span-2" />
          <button className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 font-black text-white md:w-fit">
            <Upload className="mr-2 h-4 w-4" />
            Upload Sertifikat
          </button>
        </form>
        <div className="grid gap-3 md:grid-cols-2">
          {data.certificates.map((certificate) => (
            <div key={certificate.id || certificate.title} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="font-black text-primary">{certificate.title}</p>
              <p className="text-sm text-secondary/70">{certificate.issuer} · {certificate.date}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">{certificate.status}</span>
                {certificate.fileUrl && (
                  <a href={certificate.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Preview
                  </a>
                )}
                {certificate.id && (
                  <form action={deleteMemberCertificate}>
                    <input type="hidden" name="id" value={certificate.id} />
                    <button className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
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
