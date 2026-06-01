import { getServerSession } from "next-auth";

import AgendaLearningSection from "@/components/landing/AgendaLearningSection";
import DocumentationSection from "@/components/landing/DocumentationSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import HeroSection from "@/components/landing/HeroSection";
import LatestNewsSection from "@/components/landing/LatestNewsSection";
import NdpSection from "@/components/landing/NdpSection";
import TeamSection from "@/components/landing/TeamSection";
import VisionMissionSection from "@/components/landing/VisionMissionSection";
import MovementParallaxSection from "@/components/pmii/MovementParallaxSection";
import { authOptions } from "@/lib/auth";
import { getLandingContent } from "@/lib/landing/service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const content = await getLandingContent();
  const selectedPostSlugs = content.news.selectedSlugs.filter(Boolean);
  const selectedActivitySlugs = content.agenda.selectedSlugs.filter(Boolean);
  const [latestPosts, upcomingActivities, pastActivities, galleryItems] =
    await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          ...(selectedPostSlugs.length > 0 ? { slug: { in: selectedPostSlugs } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: content.news.displayCount,
      }),
      prisma.activity.findMany({
        where: {
          published: true,
          scope: "PUBLIC",
          startDate: { gte: new Date() },
          ...(selectedActivitySlugs.length > 0 ? { slug: { in: selectedActivitySlugs } } : {}),
        },
        orderBy: { startDate: "asc" },
        take: content.agenda.displayCount,
      }),
      prisma.activity.findMany({
        where: {
          published: true,
          scope: "PUBLIC",
          startDate: { lt: new Date() },
          ...(selectedActivitySlugs.length > 0 ? { slug: { in: selectedActivitySlugs } } : {}),
        },
        orderBy: { startDate: "desc" },
        take: content.agenda.displayCount,
      }),
      prisma.activity.findMany({
        where: { published: true, photos: { some: {} } },
        include: { photos: { take: 4, orderBy: { createdAt: "desc" } } },
        orderBy: { startDate: "desc" },
        take: 4,
      }),
    ]);

  const orderedPosts =
    selectedPostSlugs.length > 0
      ? selectedPostSlugs
          .map((slug) => latestPosts.find((post) => post.slug === slug))
          .filter((post): post is (typeof latestPosts)[number] => Boolean(post))
      : latestPosts;
  const allActivities = [...upcomingActivities, ...pastActivities];
  const latestActivities =
    selectedActivitySlugs.length > 0
      ? selectedActivitySlugs
          .map((slug) => allActivities.find((activity) => activity.slug === slug))
          .filter((activity): activity is (typeof allActivities)[number] => Boolean(activity))
      : allActivities.slice(0, content.agenda.displayCount);

  return (
    <div className="overflow-x-hidden bg-background">
      <HeroSection content={content.hero} />
      <VisionMissionSection content={content.visionMission} />
      <NdpSection content={content.ndp} />
      <TeamSection content={content.team} />
      <DocumentationSection
        content={content.documentation}
        galleryItems={galleryItems}
      />
      <MovementParallaxSection cards={content.movement.cards} />
      <LatestNewsSection content={content.news} posts={orderedPosts} />
      <AgendaLearningSection
        content={content.agenda}
        activities={latestActivities}
      />
      {!session && <FinalCtaSection content={content.finalCta} />}
    </div>
  );
}
