import type {
  AccessLevel,
  DashboardPermissionKey,
  PermissionConfig,
  RoleKey,
} from "./types";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 3;

export const permissionLabels: Record<DashboardPermissionKey, string> = {
  dashboard: "Dashboard",
  cmsHomepage: "CMS Homepage",
  cmsProfil: "CMS Profil",
  cmsPengurus: "CMS Pengurus",
  agenda: "Agenda",
  berita: "Berita",
  galeri: "Galeri",
  elearning: "E-Learning",
  settings: "Settings",
};

export const roleLabels: Record<RoleKey, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  CONTRIBUTOR: "Contributor",
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
      cmsHomepage: "full",
      cmsProfil: "full",
      cmsPengurus: "full",
      agenda: "full",
      berita: "full",
      galeri: "full",
      elearning: "full",
      settings: "full",
    },
    ADMIN: {
      dashboard: "view",
      cmsHomepage: "edit",
      cmsProfil: "edit",
      cmsPengurus: "edit",
      agenda: "full",
      berita: "full",
      galeri: "full",
      elearning: "full",
      settings: "none",
    },
    EDITOR: {
      dashboard: "view",
      cmsHomepage: "view",
      cmsProfil: "view",
      cmsPengurus: "view",
      agenda: "edit",
      berita: "edit",
      galeri: "edit",
      elearning: "edit",
      settings: "none",
    },
    CONTRIBUTOR: {
      dashboard: "view",
      cmsHomepage: "none",
      cmsProfil: "none",
      cmsPengurus: "none",
      agenda: "view",
      berita: "edit",
      galeri: "edit",
      elearning: "view",
      settings: "none",
    },
  },
};

export function normalizeRole(role?: string | null): RoleKey {
  if (role === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (role === "ADMIN" || role === "ADMIN_CABANG" || role === "PENGURUS_CABANG") {
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
