import "server-only";

import { prisma } from "@/lib/prisma";
import type { TeamMember } from "@/lib/landing/types";

type OfficerPlacement = "all" | "homepage" | "profile";

export async function getOfficerTeamMembers({
  placement = "all",
  fallback = [],
}: {
  placement?: OfficerPlacement;
  fallback?: TeamMember[];
} = {}): Promise<TeamMember[]> {
  const where = {
    ...(placement === "homepage" ? { showOnHomepage: true } : {}),
    ...(placement === "profile" ? { showOnProfile: true } : {}),
    ...(placement === "all" ? {} : { isActive: true }),
  };

  const officers = await prisma.officer.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  if (officers.length === 0) {
    return fallback
      .filter((member) => {
        if (placement === "homepage") return member.showOnHomepage !== false;
        if (placement === "profile") return member.showOnProfile !== false;
        return true;
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  return officers.map((officer) => ({
    image: officer.image,
    alt: officer.imageAlt || officer.name,
    name: officer.name,
    role: officer.role,
    department: officer.department || undefined,
    isActive: officer.isActive,
    showOnHomepage: officer.showOnHomepage,
    showOnProfile: officer.showOnProfile,
    sortOrder: officer.sortOrder,
  }));
}

export async function replaceOfficersFromTeamMembers(members: TeamMember[]) {
  const data = members.map((member, index) => ({
    name: member.name,
    role: member.role,
    department: member.department || null,
    image: member.image || "/PMII_BPP.png",
    imageAlt: member.alt || member.name || "Foto pengurus PMII Balikpapan",
    sortOrder: member.sortOrder ?? index + 1,
    isActive: member.isActive ?? true,
    showOnHomepage: member.showOnHomepage ?? true,
    showOnProfile: member.showOnProfile ?? true,
  }));

  await prisma.$transaction([
    prisma.officer.deleteMany({}),
    ...(data.length > 0 ? [prisma.officer.createMany({ data })] : []),
  ]);
}
