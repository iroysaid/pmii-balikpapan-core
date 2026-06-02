import type {
  AccessLevel,
  DashboardPermissionKey,
  KaderPermissionKey,
  PermissionConfig,
  RoleKey,
} from "./types";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 3;

export const permissionLabels: Record<DashboardPermissionKey, string> = {
  dashboard: "Dashboard Admin",
  dashboardKader: "Dashboard Kader",
  cmsHomepage: "CMS Homepage",
  cmsProfil: "CMS Profil",
  cmsPengurus: "CMS Pengurus",
  agenda: "Agenda",
  berita: "Berita",
  galeri: "Galeri",
  elearning: "Learning Management",
  userRole: "User & Role",
  settings: "Settings",
};

export const kaderPermissionLabels: Record<KaderPermissionKey, string> = {
  sertifikat: "Sertifikat",
  portofolio: "Portofolio",
  riwayatOrganisasi: "Riwayat Organisasi",
};

export const roleLabels: Record<RoleKey, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin Website / Pengurus Cabang",
  EDITOR: "Pengurus Komisariat",
  CONTRIBUTOR: "Kader / Contributor",
};

export const accessLabels: Record<AccessLevel, string> = {
  none: "No Access",
  view: "View Only",
  edit: "Edit",
  full: "Full Access",
};

export const defaultPermissionConfig: PermissionConfig = {
  sessionMaxAgeSeconds: SESSION_MAX_AGE_SECONDS,
  roles: {
    SUPER_ADMIN: {
      dashboard: "full",
      dashboardKader: "full",
      cmsHomepage: "full",
      cmsProfil: "full",
      cmsPengurus: "full",
      agenda: "full",
      berita: "full",
      galeri: "full",
      elearning: "full",
      userRole: "full",
      settings: "full",
      sertifikat: "full",
      portofolio: "full",
      riwayatOrganisasi: "full",
    },
    ADMIN: {
      dashboard: "full",
      dashboardKader: "view",
      cmsHomepage: "edit",
      cmsProfil: "edit",
      cmsPengurus: "edit",
      agenda: "full",
      berita: "full",
      galeri: "full",
      elearning: "full",
      userRole: "edit",
      settings: "none",
      sertifikat: "view",
      portofolio: "view",
      riwayatOrganisasi: "view",
    },
    EDITOR: {
      dashboard: "view",
      dashboardKader: "view",
      cmsHomepage: "view",
      cmsProfil: "view",
      cmsPengurus: "view",
      agenda: "edit",
      berita: "edit",
      galeri: "edit",
      elearning: "edit",
      userRole: "view",
      settings: "none",
      sertifikat: "view",
      portofolio: "view",
      riwayatOrganisasi: "view",
    },
    CONTRIBUTOR: {
      dashboard: "none",
      dashboardKader: "full",
      cmsHomepage: "none",
      cmsProfil: "none",
      cmsPengurus: "none",
      agenda: "none",
      berita: "none",
      galeri: "none",
      elearning: "none",
      userRole: "none",
      settings: "none",
      sertifikat: "full",
      portofolio: "full",
      riwayatOrganisasi: "full",
    },
  },
};

export function normalizeRole(role?: string | null): RoleKey {
  if (role === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (
    role === "ADMIN" ||
    role === "ADMIN_WEBSITE" ||
    role === "ADMIN_CABANG" ||
    role === "PENGURUS_CABANG"
  ) {
    return "ADMIN";
  }
  if (role === "EDITOR" || role === "PENGURUS_KOMISARIAT") return "EDITOR";
  return "CONTRIBUTOR";
}

export function hasAccess(level?: AccessLevel, minimum: AccessLevel = "view") {
  const rank: Record<AccessLevel, number> = {
    none: 0,
    view: 1,
    edit: 2,
    full: 3,
  };

  return rank[level || "none"] >= rank[minimum];
}
