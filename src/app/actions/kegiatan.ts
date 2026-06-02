"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDashboardPermission } from "@/lib/permissions/guards";

async function getAuthorizedSession() {
    return requireDashboardPermission("agenda", "edit");
}

export async function createActivity(formData: FormData) {
  const session = await getAuthorizedSession();
  const organizationId = session.user.organizationId as string | null;

  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get("description") as string;
  
  const startDate = new Date(formData.get("startDate") as string);
  const endDateStr = formData.get("endDate") as string;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  
  const location = formData.get("location") as string || null;
  const organizer = formData.get("organizer") as string || null;
  const scope = formData.get("scope") as string || "PUBLIC";
  const published = formData.get("published") === "true";
  
  const image = formData.get("image") as string;
  
  const isInvitation = formData.get("isInvitation") === "on";
  const theme = formData.get("theme") as string || "modern-blue";
  const musicUrl = formData.get("musicUrl") as string || null;
  const locationUrl = formData.get("locationUrl") as string || null;
  const locationName = formData.get("locationName") as string || null;
  
  // Extract photo URLs from a hidden field or multiple inputs
  const photosJson = formData.get("photosJson") as string;
  const photos = JSON.parse(photosJson || "[]") as string[];

  await prisma.activity.create({
    data: {
      title,
      slug,
      description,
      startDate,
      endDate,
      location,
      organizer,
      scope,
      published,
      image,
      isInvitation,
      theme,
      musicUrl,
      locationUrl,
      locationName,
      organizationId,
      photos: {
        create: photos.map(url => ({ url }))
      }
    },
  });

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
  redirect("/dashboard/kegiatan");
}

export async function updateActivity(id: string, formData: FormData) {
  const session = await getAuthorizedSession();
  
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new Error("Not found");
  if (session.user.role === "PENGURUS_KOMISARIAT" && activity.organizationId !== session.user.organizationId) {
      throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get("description") as string;
  
  const startDate = new Date(formData.get("startDate") as string);
  const endDateStr = formData.get("endDate") as string;
  const endDate = endDateStr ? new Date(endDateStr) : null;
  
  const location = formData.get("location") as string || null;
  const organizer = formData.get("organizer") as string || null;
  const scope = formData.get("scope") as string || "PUBLIC";
  const published = formData.get("published") === "true";
  
  const image = formData.get("image") as string;

  const isInvitation = formData.get("isInvitation") === "on";
  const theme = formData.get("theme") as string || "modern-blue";
  const musicUrl = formData.get("musicUrl") as string || null;
  const locationUrl = formData.get("locationUrl") as string || null;
  const locationName = formData.get("locationName") as string || null;

  const photosJson = formData.get("photosJson") as string;
  const photos = JSON.parse(photosJson || "[]") as string[];

  await prisma.activity.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      startDate,
      endDate,
      location,
      organizer,
      scope,
      published,
      image,
      isInvitation,
      theme,
      musicUrl,
      locationUrl,
      locationName,
      photos: {
        deleteMany: {}, 
        create: photos.map(url => ({ url }))
      }
    },
  });

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
  redirect("/dashboard/kegiatan");
}

export async function deleteActivity(id: string) {
  const session = await getAuthorizedSession();
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new Error("Not found");
  if (session.user.role === "PENGURUS_KOMISARIAT" && activity.organizationId !== session.user.organizationId) {
      throw new Error("Unauthorized");
  }

  await prisma.activity.delete({
    where: { id },
  });
  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kegiatan");
  revalidatePath("/");
}

const agendaRegistrationStatuses = [
  "REGISTERED",
  "PENDING",
  "ACCEPTED",
  "PRESENT",
  "DONE",
  "REJECTED",
] as const;

export async function updateAgendaRegistrationStatus(formData: FormData) {
  await getAuthorizedSession();

  const registrationId = formData.get("registrationId") as string;
  const status = formData.get("status") as string;
  const note = formData.get("note") as string;

  if (!registrationId || !agendaRegistrationStatuses.includes(status as never)) {
    throw new Error("Status peserta tidak valid.");
  }

  const existing = await prisma.agendaRegistration.findUnique({
    where: { id: registrationId },
    include: {
      activity: true,
      user: true,
    },
  });

  if (!existing) {
    throw new Error("Pendaftaran peserta tidak ditemukan.");
  }

  const now = new Date();

  await prisma.agendaRegistration.update({
    where: { id: registrationId },
    data: {
      status,
      note: note || null,
      verifiedAt: status === "ACCEPTED" ? now : existing.verifiedAt,
      attendedAt: status === "PRESENT" ? now : existing.attendedAt,
      completedAt: status === "DONE" ? now : existing.completedAt,
    },
  });

  if (status === "DONE") {
    const existingCertificate = await prisma.memberCertificate.findFirst({
      where: {
        userId: existing.userId,
        category: "Agenda",
        title: `Sertifikat ${existing.activity.title}`,
      },
    });

    if (!existingCertificate) {
      await prisma.memberCertificate.create({
        data: {
          userId: existing.userId,
          title: `Sertifikat ${existing.activity.title}`,
          issuer: existing.activity.organizer || "PMII Balikpapan",
          category: "Agenda",
          status: "VERIFIED",
          issuedAt: now,
        },
      });
    }
  }

  revalidatePath(`/dashboard/kegiatan/${existing.activityId}/rsvp`);
  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/kader");
  revalidatePath("/kader/agenda");
  revalidatePath("/kader/sertifikat");
}
