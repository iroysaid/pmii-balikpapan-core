import { prisma } from "@/lib/prisma";
import type {
  MemberAgendaItem,
  MemberAchievement,
  MemberCertificate,
  MemberLearningItem,
  MemberOrganizationHistory,
  MemberPortfolioItem,
  MemberQuickAction,
} from "./types";

export async function ensureMemberCard(userId: string) {
  const existing = await prisma.memberCard.findUnique({
    where: { userId },
  });

  if (existing) {
    if (existing.qrPayload) return existing;

    return prisma.memberCard.update({
      where: { id: existing.id },
      data: {
        qrPayload: `/verifikasi/kartu/${existing.id}`,
      },
    });
  }

  const card = await prisma.memberCard.create({
    data: {
      userId,
    },
  });

  return prisma.memberCard.update({
    where: { id: card.id },
    data: {
      qrPayload: `/verifikasi/kartu/${card.id}`,
    },
  });
}

export async function getMemberDashboardData(userId: string) {
  const [user, materials, activities] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        kaderProfile: true,
        memberCard: true,
        organizationHistories: { orderBy: [{ sortOrder: "asc" }, { year: "desc" }] },
        learningProgress: true,
        agendaRegistrations: { include: { activity: true } },
        certificates: { orderBy: { createdAt: "desc" } },
        achievements: { orderBy: { createdAt: "desc" } },
        badges: { orderBy: { awardedAt: "desc" } },
        portfolios: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.material.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        chapters: { orderBy: { sortOrder: "asc" }, take: 1 },
        learningProgress: {
          where: { userId },
        },
      },
    }),
    prisma.activity.findMany({
      where: { published: true },
      orderBy: { startDate: "asc" },
      take: 5,
    }),
  ]);

  const profile = user?.kaderProfile;
  const progressByPath = new Map(
    user?.learningProgress.map((item) => [item.path, item]) || []
  );
  const trainingYears = [
    profile?.mapabaYear && { title: "MAPABA", year: profile.mapabaYear },
    profile?.pkdYear && { title: "PKD", year: profile.pkdYear },
    profile?.pklYear && { title: "PKL", year: profile.pklYear },
    profile?.pknYear && { title: "PKN", year: profile.pknYear },
  ].filter(Boolean) as { title: string; year: string }[];
  const completedPathFromMaterials = new Set(
    materials
      .filter((material) => material.learningProgress.some((progress) => progress.status === "DONE"))
      .map((material) => material.pathKey)
  );
  const hasCompletedPath = (path: string) =>
    completedPathFromMaterials.has(path) ||
    (path === "MAPABA" && Boolean(profile?.mapabaYear)) ||
    (path === "PKD" && Boolean(profile?.pkdYear)) ||
    (path === "PKL" && Boolean(profile?.pklYear)) ||
    (path === "PKN" && Boolean(profile?.pknYear));

  const learningPath: MemberLearningItem[] = [
    {
      title: "MAPABA",
      path: "Modul Dasar",
      status: getLearningStatus(progressByPath.get("MAPABA")?.status, hasCompletedPath("MAPABA") ? "DONE" : "IN_PROGRESS"),
      progress: progressByPath.get("MAPABA")?.progress ?? (hasCompletedPath("MAPABA") ? 100 : 35),
      description: "Pengenalan PMII, Aswaja, NDP, dan tradisi pergerakan.",
    },
    {
      title: "PKD",
      path: "Modul Menengah",
      status: getLearningStatus(progressByPath.get("PKD")?.status, hasCompletedPath("MAPABA") ? (hasCompletedPath("PKD") ? "DONE" : "NOT_STARTED") : "LOCKED"),
      progress: progressByPath.get("PKD")?.progress ?? (hasCompletedPath("PKD") ? 100 : 0),
      description: "Pendalaman ideologi, analisis sosial, dan kecakapan kader.",
    },
    {
      title: "PKL",
      path: "Modul Lanjutan",
      status: getLearningStatus(progressByPath.get("PKL")?.status, hasCompletedPath("PKD") ? (hasCompletedPath("PKL") ? "DONE" : "NOT_STARTED") : "LOCKED"),
      progress: progressByPath.get("PKL")?.progress ?? (hasCompletedPath("PKL") ? 100 : 0),
      description: "Kepemimpinan strategis dan desain gerakan organisasi.",
    },
    {
      title: "PKN",
      path: "Modul Nasional",
      status: getLearningStatus(progressByPath.get("PKN")?.status, hasCompletedPath("PKL") ? (hasCompletedPath("PKN") ? "DONE" : "NOT_STARTED") : "LOCKED"),
      progress: progressByPath.get("PKN")?.progress ?? (hasCompletedPath("PKN") ? 100 : 0),
      description: "Kaderisasi tingkat nasional dan pengabdian strategis.",
    },
  ];

  const registrationByActivityId = new Map(
    user?.agendaRegistrations.map((registration) => [registration.activityId, registration]) || []
  );

  const agendas: MemberAgendaItem[] = activities.map((activity) => {
    const registration = registrationByActivityId.get(activity.id);
    return {
      id: activity.id,
      title: activity.title,
      date: activity.startDate.toISOString(),
      location: activity.location,
      status: registration ? mapAgendaRegistrationStatus(registration.status) : "AVAILABLE",
      href: `/kegiatan/${activity.slug}`,
    };
  });

  const persistedCertificates: MemberCertificate[] = user?.certificates.map((certificate) => ({
    id: certificate.id,
    title: certificate.title,
    issuer: certificate.issuer || "PMII Balikpapan",
    date: certificate.issuedAt?.toISOString() || certificate.createdAt.toISOString(),
    status: certificate.status as MemberCertificate["status"],
    category: certificate.category,
    fileUrl: certificate.fileUrl,
  })) || [];

  const certificates: MemberCertificate[] = persistedCertificates.length > 0 ? persistedCertificates : trainingYears.map((training) => ({
    title: `Sertifikat ${training.title}`,
    issuer: "PC PMII Balikpapan",
    date: training.year,
    status: "VERIFIED",
    category: "Kaderisasi",
  }));

  const persistedAchievements: MemberAchievement[] = [
    ...(user?.achievements.map((achievement) => ({
      title: achievement.title,
      description: achievement.description || "Pencapaian kader.",
      level: achievement.level || "Personal",
    })) || []),
    ...(user?.badges.map((badge) => ({
      title: badge.label,
      description: badge.description || "Badge kader PMII.",
      level: "Badge",
    })) || []),
  ];

  const achievements: MemberAchievement[] = persistedAchievements.length > 0 ? persistedAchievements : [
    {
      title: profile?.status === "VERIFIED" ? "Kader Aktif" : "Menunggu Verifikasi",
      description: profile?.status === "VERIFIED"
        ? "Status keanggotaan sudah diverifikasi oleh pengurus."
        : "Lengkapi data dan tunggu verifikasi pengurus.",
      level: "Keanggotaan",
    },
    ...trainingYears.map((training) => ({
      title: `Peserta ${training.title}`,
      description: `Tercatat mengikuti jenjang ${training.title} pada ${training.year}.`,
      level: "Kaderisasi",
    })),
  ];

  const portfolios: MemberPortfolioItem[] = user?.portfolios.length ? user.portfolios.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    description: item.description || "Portofolio kader PMII.",
    href: item.externalUrl || item.fileUrl || undefined,
  })) : [
    {
      title: "Ruang Portofolio Kader",
      type: "Portfolio",
      description: "Tambahkan karya tulis, proposal, dokumentasi kegiatan, link karya, atau pengalaman organisasi.",
    },
  ];

  const histories: MemberOrganizationHistory[] = user?.organizationHistories.length ? user.organizationHistories.map((history) => ({
    id: history.id,
    year: history.year,
    level: history.level,
    role: history.role,
    description: history.description || history.activity || "Riwayat organisasi kader.",
  })) : [
    profile?.mapabaYear && {
      year: profile.mapabaYear,
      level: profile.komisariat || "Komisariat",
      role: "Anggota MAPABA",
      description: "Mulai berproses sebagai kader PMII.",
    },
    profile?.pkdYear && {
      year: profile.pkdYear,
      level: "Cabang/Komisariat",
      role: "Peserta PKD",
      description: "Mengikuti pendalaman kaderisasi formal.",
    },
  ].filter(Boolean) as MemberOrganizationHistory[];

  const quickActions: MemberQuickAction[] = [
    { label: "Lengkapi Profil", href: "/kader/profil", tone: "primary" },
    { label: "Mulai Belajar", href: "/kader/learning", tone: "accent" },
    { label: "Lihat Agenda", href: "/kader/agenda", tone: "soft" },
    { label: "Upload Sertifikat", href: "/kader/sertifikat", tone: "soft" },
  ];

  return {
    user,
    profile,
    memberCard: user?.memberCard,
    materials,
    agendas,
    certificates,
    achievements,
    portfolios,
    histories,
    learningPath,
    quickActions,
    progress: {
      kaderisasi: Math.round(
        learningPath.reduce((total, item) => total + item.progress, 0) / learningPath.length
      ),
      learning: materials.length > 0
        ? Math.round(
            materials.reduce((total, material) => total + (material.learningProgress[0]?.progress || 0), 0) / materials.length
          )
        : 0,
    },
  };
}

function mapAgendaRegistrationStatus(status: string): MemberAgendaItem["status"] {
  if (status === "PENDING") return "PENDING";
  if (status === "ACCEPTED") return "ACCEPTED";
  if (status === "PRESENT") return "PRESENT";
  if (status === "DONE") return "DONE";
  if (status === "REJECTED") return "REJECTED";
  return "REGISTERED";
}

function getLearningStatus(
  value: string | undefined,
  fallback: MemberLearningItem["status"]
): MemberLearningItem["status"] {
  if (
    value === "LOCKED" ||
    value === "NOT_STARTED" ||
    value === "IN_PROGRESS" ||
    value === "DONE"
  ) {
    return value;
  }

  return fallback;
}
