import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { profileDefaults } from "@/content/profile-defaults";
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
    const raw = await fs.readFile(PROFILE_CONTENT_PATH, "utf8");
    return mergeProfileContent(JSON.parse(raw) as Partial<ProfileContent>);
  } catch {
    return profileDefaults;
  }
}

export async function saveProfileContent(content: ProfileContent) {
  await fs.mkdir(path.dirname(PROFILE_CONTENT_PATH), { recursive: true });
  await fs.writeFile(
    PROFILE_CONTENT_PATH,
    `${JSON.stringify(mergeProfileContent(content), null, 2)}\n`,
    "utf8"
  );
}

export function getProfileContentFilePath() {
  return PROFILE_CONTENT_PATH;
}
