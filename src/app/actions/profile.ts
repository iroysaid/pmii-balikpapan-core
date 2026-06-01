"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { saveProfileContent } from "@/lib/profile/service";
import type { ProfileContent } from "@/lib/profile/types";

async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can edit profile content.");
  }
}

export async function updateProfileContent(formData: FormData) {
  await checkSuperAdmin();

  const raw = formData.get("content") as string;
  if (!raw) {
    throw new Error("Konten profil tidak boleh kosong.");
  }

  let content: ProfileContent;
  try {
    content = JSON.parse(raw) as ProfileContent;
  } catch {
    throw new Error("Format JSON profil tidak valid.");
  }

  await saveProfileContent(content);
  revalidatePath("/profil");
  revalidatePath("/dashboard/profil");
}
