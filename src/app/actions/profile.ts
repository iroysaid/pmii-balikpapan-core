"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { hasAccess } from "@/lib/permissions/defaults";
import { getRolePermissions } from "@/lib/permissions/routes";
import { saveProfileContent } from "@/lib/profile/service";
import type { ProfileContent } from "@/lib/profile/types";

async function checkProfileCmsPermission() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    throw new Error("Unauthorized.");
  }

  if (session.user.role === "SUPER_ADMIN") {
    return;
  }

  const permissions = session.user.permissions || getRolePermissions(session.user.role);
  if (!hasAccess(permissions.cmsProfil, "edit")) {
    throw new Error("Unauthorized: insufficient CMS profile permission.");
  }
}

export async function updateProfileContent(formData: FormData) {
  await checkProfileCmsPermission();

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
