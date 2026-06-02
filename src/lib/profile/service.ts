import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { profileDefaults } from "@/content/profile-defaults";
import { prisma } from "@/lib/prisma";
import type { ProfileContent } from "./types";

const PROFILE_CONTENT_PATH = path.join(
  process.cwd(),
  "data",
  "profile-content.json"
);

function mergeProfileContent(content?: Partial<ProfileContent>): ProfileContent {
  return {
    ...profileDefaults,
    ...content,
    hero: { ...profileDefaults.hero, ...content?.hero },
    history: { ...profileDefaults.history, ...content?.history },
    visionMission: {
      ...profileDefaults.visionMission,
      ...content?.visionMission,
    },
    values: { ...profileDefaults.values, ...content?.values },
    structure: { ...profileDefaults.structure, ...content?.structure },
    secretariat: { ...profileDefaults.secretariat, ...content?.secretariat },
  };
}

export async function getProfileContent(): Promise<ProfileContent> {
  try {
    const record = await prisma.cmsPageContent.findUnique({
      where: { key: "profile" },
    });

    if (record?.content) {
      return mergeProfileContent(JSON.parse(record.content) as Partial<ProfileContent>);
    }
  } catch (error) {
    console.error("[CMS] Failed to read profile content from database:", error);
  }

  try {
    const raw = await fs.readFile(PROFILE_CONTENT_PATH, "utf8");
    return mergeProfileContent(JSON.parse(raw) as Partial<ProfileContent>);
  } catch {
    return profileDefaults;
  }
}

export async function saveProfileContent(content: ProfileContent) {
  const merged = mergeProfileContent(content);

  await prisma.cmsPageContent.upsert({
    where: { key: "profile" },
    create: {
      key: "profile",
      title: "Profil PMII Balikpapan",
      content: JSON.stringify(merged),
      status: "PUBLISHED",
    },
    update: {
      title: "Profil PMII Balikpapan",
      content: JSON.stringify(merged),
      status: "PUBLISHED",
    },
  });

  await fs.mkdir(path.dirname(PROFILE_CONTENT_PATH), { recursive: true });
  await fs.writeFile(
    PROFILE_CONTENT_PATH,
    `${JSON.stringify(merged, null, 2)}\n`,
    "utf8"
  );
}

export function getProfileContentFilePath() {
  return `database:CmsPageContent(profile) fallback:${PROFILE_CONTENT_PATH}`;
}
