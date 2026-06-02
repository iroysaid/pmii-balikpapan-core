export type MemberQuickAction = {
  label: string;
  href: string;
  tone: "primary" | "accent" | "soft";
};

export type MemberLearningStatus = "LOCKED" | "NOT_STARTED" | "IN_PROGRESS" | "DONE";

export type MemberLearningItem = {
  title: string;
  path: string;
  status: MemberLearningStatus;
  progress: number;
  description: string;
};

export type MemberAgendaItem = {
  id?: string;
  title: string;
  date: string;
  location?: string | null;
  status: "AVAILABLE" | "REGISTERED" | "PENDING" | "ACCEPTED" | "DONE";
  href: string;
};

export type MemberCertificate = {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  status: "VERIFIED" | "PENDING" | "DRAFT";
  category: string;
  fileUrl?: string | null;
};

export type MemberAchievement = {
  title: string;
  description: string;
  level: string;
};

export type MemberPortfolioItem = {
  id?: string;
  title: string;
  type: string;
  description: string;
  href?: string;
};

export type MemberOrganizationHistory = {
  id?: string;
  year: string;
  level: string;
  role: string;
  description: string;
};
