export type DashboardPermissionKey =
  | "dashboard"
  | "dashboardKader"
  | "cmsHomepage"
  | "cmsProfil"
  | "cmsPengurus"
  | "agenda"
  | "berita"
  | "galeri"
  | "elearning"
  | "userRole"
  | "settings";
export type KaderPermissionKey =
  | "sertifikat"
  | "portofolio"
  | "riwayatOrganisasi";

export type AccessLevel = "none" | "view" | "edit" | "full";

export type RoleKey = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR";

export type RolePermissionMatrix = Record<
  RoleKey,
  Record<DashboardPermissionKey | KaderPermissionKey, AccessLevel>
>;

export type PermissionConfig = {
  roles: RolePermissionMatrix;
  sessionMaxAgeSeconds: number;
};
