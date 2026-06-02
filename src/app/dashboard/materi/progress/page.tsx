import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";

import { reviewLearningAssignment } from "@/app/actions/member";
import SubmitButton from "@/components/dashboard/SubmitButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LearningProgressAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    redirect("/masuk?callbackUrl=/dashboard/materi/progress");
  }

  if (session.user.role === "KADER") {
    redirect("/kader/learning");
  }

  const [progressItems, quizAttempts, submissions] = await Promise.all([
    prisma.memberLearningProgress.findMany({
      include: {
        user: { include: { kaderProfile: true } },
        material: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    }),
    prisma.learningQuizAttempt.findMany({
      include: {
        user: { include: { kaderProfile: true } },
        quiz: { include: { material: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.learningAssignmentSubmission.findMany({
      include: {
        user: { include: { kaderProfile: true } },
        material: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/dashboard/materi" className="mb-3 inline-flex items-center text-sm font-bold text-secondary hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Learning Management
          </Link>
          <h1 className="text-2xl font-black text-primary">Progress Learning Kader</h1>
          <p className="mt-2 text-secondary">Pantau progres modul, quiz, tugas, dan sertifikat learning kader.</p>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h2 className="font-black text-primary">Progress Modul</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-black uppercase text-secondary">
              <tr>
                <th className="px-5 py-3">Kader</th>
                <th className="px-5 py-3">Modul</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {progressItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <p className="font-black text-primary">{item.user.name}</p>
                    <p className="text-xs text-secondary/60">{item.user.kaderProfile?.komisariat || "-"}</p>
                  </td>
                  <td className="px-5 py-4">{item.material?.title || item.path}</td>
                  <td className="px-5 py-4">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-blue-50">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
                    </div>
                    <p className="mt-1 text-xs font-black text-primary">{item.progress}%</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-secondary">{item.status}</td>
                </tr>
              ))}
              {progressItems.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">Belum ada progress learning.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="font-black text-primary">Quiz Attempt</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {quizAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-black text-primary">{attempt.user.name}</p>
                  <p className="text-sm text-secondary/70">{attempt.quiz.material.title}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black ${attempt.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {attempt.passed ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                  {attempt.score}
                </span>
              </div>
            ))}
            {quizAttempts.length === 0 && <p className="p-5 text-sm text-gray-400">Belum ada quiz attempt.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="font-black text-primary">Review Tugas</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {submissions.map((submission) => (
              <div key={submission.id} className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-primary">{submission.user.name}</p>
                    <p className="text-sm text-secondary/70">{submission.material.title}</p>
                    <p className="mt-1 text-xs text-secondary/60"><Clock className="mr-1 inline h-3 w-3" />{submission.createdAt.toLocaleString("id-ID")}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-primary">{submission.status}</span>
                </div>
                {submission.note && <p className="rounded-xl bg-blue-50 p-3 text-sm text-secondary">{submission.note}</p>}
                <div className="flex flex-wrap gap-2">
                  {submission.fileUrl && <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-secondary">File</a>}
                  {submission.externalUrl && <a href={submission.externalUrl} target="_blank" rel="noreferrer" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-secondary">Link</a>}
                </div>
                <form action={reviewLearningAssignment} className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
                  <input type="hidden" name="submissionId" value={submission.id} />
                  <input name="reviewerNote" placeholder="Catatan review" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                  <SubmitButton name="status" value="APPROVED" pendingLabel="..." className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white">
                    Approve
                  </SubmitButton>
                  <SubmitButton name="status" value="REJECTED" pendingLabel="..." className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white">
                    Reject
                  </SubmitButton>
                </form>
              </div>
            ))}
            {submissions.length === 0 && <p className="p-5 text-sm text-gray-400">Belum ada tugas masuk.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
