"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { savePermissionConfig } from "@/lib/permissions/service";
import type { PermissionConfig } from "@/lib/permissions/types";

async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can edit permissions.");
  }
}

export async function updatePermissionConfig(formData: FormData) {
  await checkSuperAdmin();

  const raw = formData.get("config") as string;
  if (!raw) {
    throw new Error("Konfigurasi permission tidak boleh kosong.");
  }

  let config: PermissionConfig;
  try {
    config = JSON.parse(raw) as PermissionConfig;
  } catch {
    throw new Error("Format konfigurasi permission tidak valid.");
  }

  await savePermissionConfig(config);
  revalidatePath("/dashboard/settings");
}
