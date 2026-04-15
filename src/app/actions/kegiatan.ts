"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createActivity(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get("description") as string;
  const eventDate = new Date(formData.get("eventDate") as string);
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
      eventDate,
      image,
      isInvitation,
      theme,
      musicUrl,
      locationUrl,
      locationName,
      photos: {
        create: photos.map(url => ({ url }))
      }
    },
  });

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/dashboard/kegiatan");
}

export async function updateActivity(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const description = formData.get("description") as string;
  const eventDate = new Date(formData.get("eventDate") as string);
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
      eventDate,
      image,
      isInvitation,
      theme,
      musicUrl,
      locationUrl,
      locationName,
      photos: {
        deleteMany: {}, // Clear old photos (simple sync)
        create: photos.map(url => ({ url }))
      }
    },
  });

  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/galeri");
  revalidatePath("/");
  redirect("/dashboard/kegiatan");
}

export async function deleteActivity(id: string) {
  await prisma.activity.delete({
    where: { id },
  });
  revalidatePath("/dashboard/kegiatan");
  revalidatePath("/");
}
