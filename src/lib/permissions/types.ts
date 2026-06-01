export type DashboardPermissionKey =
  | "dashboard"
  | "cmsHomepage"
  | "cmsProfil"
  | "cmsPengurus"
  | "agenda"
  | "berita"
  | "galeri"
  | "elearning"
  | "settings";

export type AccessLevel = "none" | "view" | "edit" | "full";

export type RoleKey = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "CONTRIBUTOR";

export type RolePermissionMatrix = Record<
  RoleKey,
  Record<DashboardPermissionKey, AccessLevel>
>;

export type PermissionConfig = {
  roles: RolePermissionMatrix;
  sessionMaxAgeSeconds: number;
};
