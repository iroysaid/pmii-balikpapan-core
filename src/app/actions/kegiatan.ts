"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getAuthorizedSession() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const role = session.user.role as string;
    if (role === "KADER" || role === "PUBLIC") {
        throw new Error("Unauthorized: Insufficient permissions.");
    }
    return session;
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
