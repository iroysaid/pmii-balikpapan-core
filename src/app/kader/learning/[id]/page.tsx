import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft, CheckCircle2, FileText, PlayCircle, Upload } from "lucide-react";

import {
  completeMemberLesson,
  submitLearningAssignment,
  submitLearningQuiz,
} from "@/app/actions/member";
import KaderPage from "@/components/kader/KaderPage";
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
        include: {
          lessonProgress: {
            where: { userId: session.user.id },
            take: 1,
          },
        },
      },
      quiz: {
        include: {
          questions: { orderBy: { sortOrder: "asc" } },
          attempts: {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
      assignmentSubmissions: {
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 1,
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

  const profile = await prisma.kaderProfile.findUnique({
    where: { userId: session.user.id },
  });
  const isRequiredPathCompleted = material.requiredPath
    ? await hasCompletedRequiredPath(session.user.id, material.requiredPath, profile)
    : true;

  if (!isRequiredPathCompleted) {
    return (
      <KaderPage
        eyebrow="Learning Journey"
        title="Modul terkunci"
        description={`${material.title} belum bisa diakses sampai path sebelumnya selesai.`}
        action={
          <Link href="/kader/learning" className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-primary">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        }
      >
        <SectionCard title="Modul Terkunci" description={`${material.title} belum bisa diakses.`}>
          <div className="rounded-2xl bg-amber-50 p-5 text-amber-800">
            <p className="font-black">Selesaikan path {material.requiredPath} terlebih dahulu.</p>
            <p className="mt-2 text-sm">Setelah syarat selesai, modul ini otomatis terbuka di dashboard kader.</p>
          </div>
        </SectionCard>
      </KaderPage>
    );
  }

  const progress = material.learningProgress[0];
  const latestQuizAttempt = material.quiz?.attempts[0];
  const latestSubmission = material.assignmentSubmissions[0];

  return (
    <KaderPage
      eyebrow="Modul Kader"
      title={material.title}
      description={material.description || "Materi pembelajaran kader PMII Balikpapan."}
      action={
        <Link href="/kader/learning" className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-primary">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      }
    >

      <section className="min-w-0 overflow-hidden rounded-[1.5rem] bg-[#122562] p-5 text-white shadow-[0_24px_80px_rgba(18,37,98,0.22)] md:rounded-[2rem] md:p-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F5CA0F]">
          Modul Kader
        </p>
        <h2 className="mt-3 text-2xl font-black md:text-4xl">{material.title}</h2>
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

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)]">
        <SectionCard title="Lesson / Materi" description="Ikuti chapter secara bertahap lalu tandai progress belajar.">
          <div className="space-y-3">
            {material.chapters.length === 0 ? (
              <p className="text-sm text-secondary/60">Belum ada lesson pada modul ini.</p>
            ) : (
              material.chapters.map((chapter, index) => (
                <div key={chapter.id} className="min-w-0 rounded-2xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-primary">{chapter.title || `Lesson ${index + 1}`}</p>
                      <p className="mt-1 text-sm text-secondary/70">{chapter.description || "Materi pembelajaran kader."}</p>
                      {chapter.durationMin && (
                        <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-primary/70">
                          Estimasi {chapter.durationMin} menit
                        </p>
                      )}
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
                        {chapter.slideUrl && (
                          <a href={chapter.slideUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-white px-3 py-2 text-xs font-black text-primary">
                            <FileText className="mr-1 h-3 w-3" />
                            Slide
                          </a>
                        )}
                        {chapter.article && (
                          <details className="w-full rounded-2xl bg-white p-3 text-sm text-secondary/75">
                            <summary className="cursor-pointer font-black text-primary">Baca artikel</summary>
                            <div className="mt-3 whitespace-pre-line leading-relaxed">{chapter.article}</div>
                          </details>
                        )}
                        {chapter.lessonProgress[0]?.status === "DONE" ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-2 text-xs font-black text-green-700">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Selesai
                          </span>
                        ) : (
                          <form action={completeMemberLesson}>
                            <input type="hidden" name="chapterId" value={chapter.id} />
                            <input type="hidden" name="materialId" value={material.id} />
                            <button className="inline-flex items-center rounded-full bg-primary px-3 py-2 text-xs font-black text-white">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Tandai Lesson Selesai
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard title="Progress Modul" description="Lesson, quiz, dan tugas menentukan sertifikat learning otomatis.">
          <div className="space-y-3">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm font-black text-primary">{progress?.progress || 0}% selesai</p>
              <p className="mt-1 text-xs text-secondary/70">Status: {progress?.status || "NOT_STARTED"}</p>
            </div>
            {material.quiz && (
              <div className="rounded-2xl border border-blue-100 bg-white p-4">
                <h3 className="font-black text-primary">{material.quiz.title}</h3>
                <p className="mt-1 text-sm text-secondary/70">
                  Passing grade {material.quiz.passingGrade}. Skor terakhir: {latestQuizAttempt ? `${latestQuizAttempt.score}` : "belum ada"}.
                </p>
                <form action={submitLearningQuiz} className="mt-4 space-y-4">
                  <input type="hidden" name="quizId" value={material.quiz.id} />
                  <input type="hidden" name="materialId" value={material.id} />
                  {material.quiz.questions.map((question, questionIndex) => {
                    const options = parseOptions(question.optionsJson);
                    return (
                      <fieldset key={question.id} className="rounded-2xl bg-blue-50 p-3">
                        <legend className="mb-2 text-sm font-black text-primary">
                          {questionIndex + 1}. {question.question}
                        </legend>
                        <div className="grid gap-2">
                          {options.map((option) => (
                            <label key={option} className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-secondary">
                              <input required type="radio" name={`question_${question.id}`} value={option} />
                              <span className="min-w-0 break-words">{option}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
                  })}
                  <button className="w-full rounded-2xl bg-primary px-4 py-3 font-black text-white">
                    Submit Quiz
                  </button>
                </form>
              </div>
            )}
            {material.requiresAssignment && (
              <div className="rounded-2xl border border-blue-100 bg-white p-4">
                <h3 className="font-black text-primary">Tugas Modul</h3>
                <p className="mt-1 text-sm text-secondary/70">
                  {material.assignmentPrompt || "Upload file atau tautan tugas untuk direview admin."}
                </p>
                {latestSubmission && (
                  <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-primary">
                    Status terakhir: {latestSubmission.status}
                  </p>
                )}
                <form action={submitLearningAssignment} className="mt-4 space-y-3">
                  <input type="hidden" name="materialId" value={material.id} />
                  <textarea name="note" rows={3} placeholder="Catatan jawaban/tugas" className="w-full rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
                  <input name="externalUrl" placeholder="Link tugas jika ada" className="w-full rounded-2xl border border-blue-100 px-4 py-3 text-sm outline-none" />
                  <input name="file" type="file" className="w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm" />
                  <button className="inline-flex w-full items-center justify-center rounded-2xl bg-[#F5CA0F] px-4 py-3 font-black text-secondary">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Tugas
                  </button>
                </form>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </KaderPage>
  );
}

function parseOptions(value: string) {
  try {
    const options = JSON.parse(value) as unknown;
    if (Array.isArray(options)) {
      return options.map(String).filter(Boolean);
    }
  } catch {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

async function hasCompletedRequiredPath(
  userId: string,
  requiredPath: string,
  profile: {
    mapabaYear?: string | null;
    pkdYear?: string | null;
    pklYear?: string | null;
    pknYear?: string | null;
  } | null
) {
  if (requiredPath === "MAPABA" && profile?.mapabaYear) return true;
  if (requiredPath === "PKD" && profile?.pkdYear) return true;
  if (requiredPath === "PKL" && profile?.pklYear) return true;
  if (requiredPath === "PKN" && profile?.pknYear) return true;

  const completedMaterial = await prisma.material.findFirst({
    where: {
      pathKey: requiredPath,
      learningProgress: {
        some: {
          userId,
          status: "DONE",
        },
      },
    },
  });

  return Boolean(completedMaterial);
}
