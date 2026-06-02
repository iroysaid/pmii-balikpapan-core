import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, CheckCircle2, FileText, PlayCircle } from "lucide-react";

import { updateLearningPathProgress } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function KaderLearningDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/masuk?callbackUrl=/kader/learning");
  }

  const { id } = await params;
  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { sortOrder: "asc" },
      },
      learningProgress: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  });

  if (!material || !material.isPublished) {
    notFound();
  }

  const progress = material.learningProgress[0];
  const progressPath = `MATERIAL:${material.id}`;

  return (
    <div className="space-y-6">
      <Link href="/kader/learning" className="inline-flex items-center gap-2 text-sm font-black text-primary">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Learning Journey
      </Link>

      <section className="overflow-hidden rounded-[2rem] bg-[#122562] p-6 text-white shadow-[0_24px_80px_rgba(18,37,98,0.22)] md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F5CA0F]">
          Modul Kader
        </p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{material.title}</h1>
        <p className="mt-4 max-w-3xl text-white/75">
          {material.description || "Materi pembelajaran kader PMII Balikpapan."}
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/12">
          <div className="h-full rounded-full bg-[#F5CA0F]" style={{ width: `${progress?.progress || 0}%` }} />
        </div>
        <p className="mt-2 text-sm font-black text-[#F5CA0F]">
          {progress?.progress || 0}% selesai
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
        <SectionCard title="Lesson / Materi" description="Ikuti chapter secara bertahap lalu tandai progress belajar.">
          <div className="space-y-3">
            {material.chapters.length === 0 ? (
              <p className="text-sm text-secondary/60">Belum ada lesson pada modul ini.</p>
            ) : (
              material.chapters.map((chapter, index) => (
                <div key={chapter.id} className="rounded-2xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-primary">{chapter.title || `Lesson ${index + 1}`}</p>
                      <p className="mt-1 text-sm text-secondary/70">{chapter.description || "Materi pembelajaran kader."}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {chapter.youtubeUrl && (
                          <a href={chapter.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-black text-primary">
                            <PlayCircle className="mr-1 h-3 w-3" />
                            Video
                          </a>
                        )}
                        {chapter.fileUrl && (
                          <a href={chapter.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-black text-primary">
                            <FileText className="mr-1 h-3 w-3" />
                            File
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Progress" description="Simpan status belajar untuk dashboard kader.">
          <div className="space-y-3">
            <form action={updateLearningPathProgress}>
              <input type="hidden" name="path" value={progressPath} />
              <input type="hidden" name="materialId" value={material.id} />
              <input type="hidden" name="progress" value="35" />
              <input type="hidden" name="status" value="IN_PROGRESS" />
              <button className="flex w-full items-center justify-center rounded-2xl bg-blue-50 px-4 py-4 font-black text-primary">
                <PlayCircle className="mr-2 h-4 w-4" />
                Mulai / Lanjutkan
              </button>
            </form>
            <form action={updateLearningPathProgress}>
              <input type="hidden" name="path" value={progressPath} />
              <input type="hidden" name="materialId" value={material.id} />
              <input type="hidden" name="progress" value="100" />
              <input type="hidden" name="status" value="DONE" />
              <button className="flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-4 font-black text-white">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Tandai Selesai
              </button>
            </form>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
