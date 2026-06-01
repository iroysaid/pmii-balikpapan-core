import { defaultPermissionConfig, hasAccess, normalizeRole } from "./defaults";
import type {
  AccessLevel,
  DashboardPermissionKey,
  RolePermissionMatrix,
} from "./types";

export const dashboardRoutePermissions: {
  match: (path: string) => boolean;
  permission: DashboardPermissionKey;
  minimum?: AccessLevel;
}[] = [
  {
    match: (path) => path === "/dashboard",
    permission: "dashboard",
  },
  {
    match: (path) => path.startsWith("/dashboard/landing"),
    permission: "cmsHomepage",
    minimum: "edit",
  },
  {
    match: (path) => path.startsWith("/dashboard/profil"),
    permission: "cmsProfil",
    minimum: "edit",
  },
  {
    match: (path) => path.startsWith("/dashboard/pengurus"),
    permission: "cmsPengurus",
    minimum: "edit",
  },
  {
    match: (path) => path.startsWith("/dashboard/kegiatan"),
    permission: "agenda",
  },
  {
    match: (path) => path.startsWith("/dashboard/berita"),
    permission: "berita",
  },
  {
    match: (path) => path.startsWith("/dashboard/galeri"),
    permission: "galeri",
  },
  {
    match: (path) => path.startsWith("/dashboard/materi"),
    permission: "elearning",
  },
  {
    match: (path) => path.startsWith("/dashboard/settings"),
    permission: "settings",
    minimum: "full",
  },
];

export function getRequiredPermissionForPath(path: string) {
  return dashboardRoutePermissions.find((route) => route.match(path));
}

export function getRolePermissions(
  role?: string | null,
  matrix: RolePermissionMatrix = defaultPermissionConfig.roles
) {
  return matrix[normalizeRole(role)];
}

export function canAccessDashboardPath({
  path,
  role,
  permissions,
}: {
  path: string;
  role?: string | null;
  permissions?: Partial<Record<DashboardPermissionKey, AccessLevel>> | null;
}) {
  if (!path.startsWith("/dashboard")) return true;

  if (path.startsWith("/dashboard/settings") && role !== "SUPER_ADMIN") {
    return false;
  }

  const required = getRequiredPermissionForPath(path);
  if (!required) return hasAccess(permissions?.dashboard || getRolePermissions(role).dashboard);

  const fallback = getRolePermissions(role);
  const level = permissions?.[required.permission] || fallback[required.permission];
  return hasAccess(level, required.minimum || "view");
}
