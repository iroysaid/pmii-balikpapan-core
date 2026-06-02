"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

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

  await prisma.memberPortfolio.create({
    data: {
      userId: session.user.id,
      title: (formData.get("title") as string) || "Portofolio Kader",
      type: (formData.get("type") as string) || "Portfolio",
      description: (formData.get("description") as string) || null,
      externalUrl: (formData.get("externalUrl") as string) || null,
      fileUrl,
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

export async function registerMemberAgenda(formData: FormData) {
  const session = await requireMemberSession();
  const activityId = formData.get("activityId") as string;

  if (!activityId) return;

  await prisma.agendaRegistration.upsert({
    where: {
      userId_activityId: {
        userId: session.user.id,
        activityId,
      },
    },
    create: {
      userId: session.user.id,
      activityId,
      status: "REGISTERED",
    },
    update: {
      status: "REGISTERED",
    },
  });

  revalidatePath("/kader");
  revalidatePath("/kader/agenda");
}
