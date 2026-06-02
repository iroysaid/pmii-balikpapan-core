"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { getLandingContent, saveLandingContent } from "@/lib/landing/service";
import type { LandingContent, TeamMember } from "@/lib/landing/types";
import { replaceOfficersFromTeamMembers } from "@/lib/officers/service";
import { hasAccess } from "@/lib/permissions/defaults";
import { getRolePermissions } from "@/lib/permissions/routes";
import type { DashboardPermissionKey } from "@/lib/permissions/types";

async function checkCmsPermission(permission: DashboardPermissionKey) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    throw new Error("Unauthorized.");
  }

  if (session.user.role === "SUPER_ADMIN") {
    return;
  }

  const permissions = session.user.permissions || getRolePermissions(session.user.role);
  if (!hasAccess(permissions[permission], "edit")) {
    throw new Error("Unauthorized: insufficient CMS permission.");
  }
}

export async function updateLandingContent(formData: FormData) {
  await checkCmsPermission("cmsHomepage");

  const raw = formData.get("content") as string;
  if (!raw) {
    throw new Error("Konten landing tidak boleh kosong.");
  }

  let content: LandingContent;
  try {
    content = JSON.parse(raw) as LandingContent;
  } catch {
    throw new Error("Format JSON landing page tidak valid.");
  }

  await saveLandingContent(content);
  revalidatePath("/");
  revalidatePath("/dashboard/landing");
}

export async function updateTeamMembers(formData: FormData) {
  await checkCmsPermission("cmsPengurus");

  const raw = formData.get("members") as string;
  if (!raw) {
    throw new Error("Data pengurus tidak boleh kosong.");
  }

  let members: TeamMember[];
  try {
    members = JSON.parse(raw) as TeamMember[];
  } catch {
    throw new Error("Format data pengurus tidak valid.");
  }

  const content = await getLandingContent();
  const normalizedMembers = members.map((member, index) => ({
    ...member,
    sortOrder: member.sortOrder ?? index + 1,
    isActive: member.isActive ?? true,
    showOnHomepage: member.showOnHomepage ?? true,
    showOnProfile: member.showOnProfile ?? true,
  }));

  await replaceOfficersFromTeamMembers(normalizedMembers);
  await saveLandingContent({
    ...content,
    team: {
      ...content.team,
      members: normalizedMembers,
    },
  });

  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/dashboard/pengurus");
}
