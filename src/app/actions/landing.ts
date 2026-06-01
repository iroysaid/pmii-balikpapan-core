"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth";
import { getLandingContent, saveLandingContent } from "@/lib/landing/service";
import type { LandingContent, TeamMember } from "@/lib/landing/types";

async function checkSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Only Super Admin can edit landing content.");
  }
}

export async function updateLandingContent(formData: FormData) {
  await checkSuperAdmin();

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
  await checkSuperAdmin();

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
  await saveLandingContent({
    ...content,
    team: {
      ...content.team,
      members: members.map((member, index) => ({
        ...member,
        sortOrder: member.sortOrder ?? index + 1,
        showOnHomepage: member.showOnHomepage ?? true,
        showOnProfile: member.showOnProfile ?? true,
      })),
    },
  });

  revalidatePath("/");
  revalidatePath("/profil");
  revalidatePath("/dashboard/pengurus");
}
