import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { landingDefaults } from "@/content/landing-defaults";
import { prisma } from "@/lib/prisma";
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
    const record = await prisma.cmsPageContent.findUnique({
      where: { key: "homepage" },
    });

    if (record?.content) {
      return mergeLandingContent(JSON.parse(record.content) as Partial<LandingContent>);
    }
  } catch (error) {
    console.error("[CMS] Failed to read homepage content from database:", error);
  }

  try {
    const raw = await fs.readFile(LANDING_CONTENT_PATH, "utf8");
    return mergeLandingContent(JSON.parse(raw) as Partial<LandingContent>);
  } catch {
    return landingDefaults;
  }
}

export async function saveLandingContent(content: LandingContent) {
  const merged = mergeLandingContent(content);

  await prisma.cmsPageContent.upsert({
    where: { key: "homepage" },
    create: {
      key: "homepage",
      title: "Homepage PMII Balikpapan",
      content: JSON.stringify(merged),
      status: "PUBLISHED",
    },
    update: {
      title: "Homepage PMII Balikpapan",
      content: JSON.stringify(merged),
      status: "PUBLISHED",
    },
  });

  await fs.mkdir(path.dirname(LANDING_CONTENT_PATH), { recursive: true });
  await fs.writeFile(
    LANDING_CONTENT_PATH,
    `${JSON.stringify(merged, null, 2)}\n`,
    "utf8"
  );
}

export function getLandingContentFilePath() {
  return `database:CmsPageContent(homepage) fallback:${LANDING_CONTENT_PATH}`;
}
