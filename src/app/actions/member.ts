"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";
import { requireDashboardPermission } from "@/lib/permissions/guards";

export async function updateMemberProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadFile(imageFile, "kader/profile");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const birthPlace = formData.get("birthPlace") as string;
  const birthDateValue = formData.get("birthDate") as string;
  const address = formData.get("address") as string;
  const campus = formData.get("campus") as string;
  const faculty = formData.get("faculty") as string;
  const major = formData.get("major") as string;
  const komisariat = formData.get("komisariat") as string;
  const rayon = formData.get("rayon") as string;
  const mapabaYear = formData.get("mapabaYear") as string;
  const bio = formData.get("bio") as string;

  const birthDate = birthDateValue ? new Date(birthDateValue) : null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      email: email || null,
      ...(imageUrl ? { image: imageUrl } : {}),
      kaderProfile: {
        upsert: {
          create: {
            phone,
            birthPlace,
            birthDate: birthDate && !Number.isNaN(birthDate.getTime()) ? birthDate : null,
            address,
            campus,
            faculty,
            major,
            komisariat,
            rayon,
            mapabaYear,
            otherTraining: bio ? JSON.stringify([{ type: "bio", value: bio }]) : null,
          },
          update: {
            phone,
            birthPlace,
            birthDate: birthDate && !Number.isNaN(birthDate.getTime()) ? birthDate : null,
            address,
            campus,
            faculty,
            major,
            komisariat,
            rayon,
            mapabaYear,
            otherTraining: bio ? JSON.stringify([{ type: "bio", value: bio }]) : undefined,
          },
        },
      },
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/profil");
  return { success: true };
}

async function requireMemberSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function createMemberCertificate(formData: FormData) {
  const session = await requireMemberSession();
  const file = formData.get("file") as File | null;
  let fileUrl: string | undefined;

  if (file && file.size > 0) {
    fileUrl = await uploadFile(file, "kader/certificates");
  }

  const issuedAtValue = formData.get("issuedAt") as string;
  const issuedAt = issuedAtValue ? new Date(issuedAtValue) : null;

  await prisma.memberCertificate.create({
    data: {
      userId: session.user.id,
      title: (formData.get("title") as string) || "Sertifikat Kader",
      issuer: (formData.get("issuer") as string) || "PMII Balikpapan",
      category: (formData.get("category") as string) || "Umum",
      note: (formData.get("note") as string) || null,
      fileUrl,
      status: "PENDING",
      issuedAt: issuedAt && !Number.isNaN(issuedAt.getTime()) ? issuedAt : null,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/sertifikat");
}

export async function deleteMemberCertificate(formData: FormData) {
  const session = await requireMemberSession();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.memberCertificate.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/sertifikat");
}

export async function createMemberPortfolio(formData: FormData) {
  const session = await requireMemberSession();
  const file = formData.get("file") as File | null;
  let fileUrl: string | undefined;

  if (file && file.size > 0) {
    fileUrl = await uploadFile(file, "kader/portfolio");
  }

  const issuedAtValue = formData.get("issuedAt") as string;
  const issuedAt = issuedAtValue ? new Date(issuedAtValue) : null;

  await prisma.memberPortfolio.create({
    data: {
      userId: session.user.id,
      title: (formData.get("title") as string) || "Portofolio Kader",
      type: (formData.get("type") as string) || "Portfolio",
      description: (formData.get("description") as string) || null,
      externalUrl: (formData.get("externalUrl") as string) || null,
      fileUrl,
      issuedAt: issuedAt && !Number.isNaN(issuedAt.getTime()) ? issuedAt : null,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/portofolio");
}

export async function deleteMemberPortfolio(formData: FormData) {
  const session = await requireMemberSession();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.memberPortfolio.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/portofolio");
}

export async function createMemberOrganizationHistory(formData: FormData) {
  const session = await requireMemberSession();

  await prisma.memberOrganizationHistory.create({
    data: {
      userId: session.user.id,
      year: (formData.get("year") as string) || new Date().getFullYear().toString(),
      level: (formData.get("level") as string) || "PMII",
      organizationName: (formData.get("organizationName") as string) || null,
      role: (formData.get("role") as string) || "Kader",
      activity: (formData.get("activity") as string) || null,
      description: (formData.get("description") as string) || null,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/riwayat");
}

export async function deleteMemberOrganizationHistory(formData: FormData) {
  const session = await requireMemberSession();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.memberOrganizationHistory.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/riwayat");
}

export async function updateLearningPathProgress(formData: FormData) {
  const session = await requireMemberSession();
  const path = formData.get("path") as string;
  const materialId = formData.get("materialId") as string | null;
  const status = (formData.get("status") as string) || "IN_PROGRESS";
  const progressValue = Number(formData.get("progress") || 0);

  if (!path) return;

  const safeProgress = Math.max(0, Math.min(100, Number.isNaN(progressValue) ? 0 : progressValue));
  const normalizedStatus = status === "DONE"
    ? "DONE"
    : safeProgress > 0
      ? "IN_PROGRESS"
      : "NOT_STARTED";

  await prisma.memberLearningProgress.upsert({
    where: {
      userId_path: {
        userId: session.user.id,
        path,
      },
    },
    create: {
      userId: session.user.id,
      path,
      materialId: materialId || null,
      progress: safeProgress,
      status: normalizedStatus,
      completedAt: normalizedStatus === "DONE" ? new Date() : null,
    },
    update: {
      materialId: materialId || null,
      progress: safeProgress,
      status: normalizedStatus,
      completedAt: normalizedStatus === "DONE" ? new Date() : null,
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/learning");
}

export async function completeMemberLesson(formData: FormData) {
  const session = await requireMemberSession();
  const chapterId = formData.get("chapterId") as string;
  const materialId = formData.get("materialId") as string;

  if (!chapterId || !materialId) return;

  await prisma.memberLessonProgress.upsert({
    where: {
      userId_chapterId: {
        userId: session.user.id,
        chapterId,
      },
    },
    create: {
      userId: session.user.id,
      chapterId,
      status: "DONE",
      completedAt: new Date(),
    },
    update: {
      status: "DONE",
      completedAt: new Date(),
    },
  });

  await refreshMaterialLearningProgress(session.user.id, materialId);
  revalidateLearningRoutes(materialId);
}

export async function submitLearningQuiz(formData: FormData) {
  const session = await requireMemberSession();
  const quizId = formData.get("quizId") as string;
  const materialId = formData.get("materialId") as string;

  if (!quizId || !materialId) return;

  const quiz = await prisma.learningQuiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) return;

  let correctCount = 0;
  const answers: Record<string, string> = {};

  for (const question of quiz.questions) {
    const answer = formData.get(`question_${question.id}`) as string;
    answers[question.id] = answer;
    if (answer === question.correctAnswer) {
      correctCount += 1;
    }
  }

  const score = quiz.questions.length > 0
    ? Math.round((correctCount / quiz.questions.length) * 100)
    : 0;

  await prisma.learningQuizAttempt.create({
    data: {
      userId: session.user.id,
      quizId,
      score,
      passed: score >= quiz.passingGrade,
      answersJson: JSON.stringify(answers),
    },
  });

  await refreshMaterialLearningProgress(session.user.id, materialId);
  revalidateLearningRoutes(materialId);
}

export async function submitLearningAssignment(formData: FormData) {
  const session = await requireMemberSession();
  const materialId = formData.get("materialId") as string;
  const note = formData.get("note") as string;
  const externalUrl = formData.get("externalUrl") as string;
  const file = formData.get("file") as File | null;

  if (!materialId) return;

  let fileUrl: string | undefined;
  if (file && file.size > 0) {
    fileUrl = await uploadFile(file, "kader/assignments");
  }

  await prisma.learningAssignmentSubmission.create({
    data: {
      userId: session.user.id,
      materialId,
      note: note || null,
      externalUrl: externalUrl || null,
      fileUrl,
      status: "SUBMITTED",
    },
  });

  await refreshMaterialLearningProgress(session.user.id, materialId);
  revalidateLearningRoutes(materialId);
}

export async function reviewLearningAssignment(formData: FormData) {
  await requireDashboardPermission("elearning", "edit");

  const submissionId = formData.get("submissionId") as string;
  const status = formData.get("status") as string;
  const reviewerNote = formData.get("reviewerNote") as string;

  if (!submissionId || !["APPROVED", "REJECTED"].includes(status)) return;

  const submission = await prisma.learningAssignmentSubmission.update({
    where: { id: submissionId },
    data: {
      status,
      reviewerNote: reviewerNote || null,
      reviewedAt: new Date(),
    },
  });

  await refreshMaterialLearningProgress(submission.userId, submission.materialId);
  revalidatePath("/dashboard/materi/progress");
  revalidatePath("/dashboard/materi");
}

async function refreshMaterialLearningProgress(userId: string, materialId: string) {
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: {
      chapters: true,
      quiz: {
        include: {
          attempts: {
            where: { userId },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      assignmentSubmissions: {
        where: { userId },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!material) return;

  const completedLessons = await prisma.memberLessonProgress.count({
    where: {
      userId,
      chapter: { materialId },
      status: "DONE",
    },
  });

  const lessonTotal = material.chapters.length;
  const lessonPercent = lessonTotal > 0 ? completedLessons / lessonTotal : 1;
  const latestQuizAttempt = material.quiz?.attempts[0];
  const quizPassed = material.quiz ? Boolean(latestQuizAttempt?.passed) : true;
  const latestSubmission = material.assignmentSubmissions[0];
  const assignmentPassed = material.requiresAssignment
    ? latestSubmission?.status === "APPROVED"
    : true;

  const parts = [
    lessonPercent,
    material.quiz ? (quizPassed ? 1 : 0) : null,
    material.requiresAssignment ? (assignmentPassed ? 1 : 0) : null,
  ].filter((part): part is number => part !== null);
  const progress = Math.round(
    (parts.reduce((total, part) => total + part, 0) / Math.max(parts.length, 1)) * 100
  );
  const isDone = progress >= 100 && quizPassed && assignmentPassed;

  await prisma.memberLearningProgress.upsert({
    where: {
      userId_path: {
        userId,
        path: `MATERIAL:${materialId}`,
      },
    },
    create: {
      userId,
      materialId,
      path: `MATERIAL:${materialId}`,
      progress,
      status: isDone ? "DONE" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED",
      completedAt: isDone ? new Date() : null,
    },
    update: {
      materialId,
      progress,
      status: isDone ? "DONE" : progress > 0 ? "IN_PROGRESS" : "NOT_STARTED",
      completedAt: isDone ? new Date() : null,
    },
  });

  if (isDone) {
    const title = `Sertifikat Learning ${material.title}`;
    const existingCertificate = await prisma.memberCertificate.findFirst({
      where: {
        userId,
        title,
        category: "Learning",
      },
    });

    if (!existingCertificate) {
      await prisma.memberCertificate.create({
        data: {
          userId,
          title,
          issuer: "PMII Balikpapan",
          category: "Learning",
          status: "VERIFIED",
          issuedAt: new Date(),
        },
      });
    }
  }
}

function revalidateLearningRoutes(materialId: string) {
  revalidatePath("/kader");
  revalidatePath("/kader/learning");
  revalidatePath(`/kader/learning/${materialId}`);
  revalidatePath("/kader/sertifikat");
}

export async function registerMemberAgenda(formData: FormData) {
  const session = await requireMemberSession();
  const activityId = formData.get("activityId") as string;

  if (!activityId) return;

  const existing = await prisma.agendaRegistration.findUnique({
    where: {
      userId_activityId: {
        userId: session.user.id,
        activityId,
      },
    },
  });

  if (!existing) {
    await prisma.agendaRegistration.create({
      data: {
        userId: session.user.id,
        activityId,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/kader");
  revalidatePath("/kader/agenda");
}
