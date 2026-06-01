import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { landingDefaults } from "@/content/landing-defaults";
import type { LandingContent } from "./types";

const LANDING_CONTENT_PATH = path.join(
  process.cwd(),
  "data",
  "landing-content.json"
);

function mergeLandingContent(content?: Partial<LandingContent>): LandingContent {
  return {
    ...landingDefaults,
    ...content,
    navbar: { ...landingDefaults.navbar, ...content?.navbar },
    footer: { ...landingDefaults.footer, ...content?.footer },
    hero: { ...landingDefaults.hero, ...content?.hero },
    visionMission: {
      ...landingDefaults.visionMission,
      ...content?.visionMission,
    },
    ndp: { ...landingDefaults.ndp, ...content?.ndp },
    team: { ...landingDefaults.team, ...content?.team },
    documentation: {
      ...landingDefaults.documentation,
      ...content?.documentation,
    },
    movement: { ...landingDefaults.movement, ...content?.movement },
    news: { ...landingDefaults.news, ...content?.news },
    agenda: { ...landingDefaults.agenda, ...content?.agenda },
    finalCta: { ...landingDefaults.finalCta, ...content?.finalCta },
  };
}

export async function getLandingContent(): Promise<LandingContent> {
  try {
    const raw = await fs.readFile(LANDING_CONTENT_PATH, "utf8");
    return mergeLandingContent(JSON.parse(raw) as Partial<LandingContent>);
  } catch {
    return landingDefaults;
  }
}

export async function saveLandingContent(content: LandingContent) {
  await fs.mkdir(path.dirname(LANDING_CONTENT_PATH), { recursive: true });
  await fs.writeFile(
    LANDING_CONTENT_PATH,
    `${JSON.stringify(mergeLandingContent(content), null, 2)}\n`,
    "utf8"
  );
}

export function getLandingContentFilePath() {
  return LANDING_CONTENT_PATH;
}
