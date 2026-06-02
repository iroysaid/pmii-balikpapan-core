export const adminWorkspaceRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "ADMIN_WEBSITE",
  "ADMIN_CABANG",
  "PENGURUS_CABANG",
  "PENGURUS_KOMISARIAT",
  "EDITOR",
  "CONTRIBUTOR",
] as const;

export function isAdminWorkspaceRole(role?: string | null) {
  return Boolean(role && adminWorkspaceRoles.includes(role as never));
}

export function isKaderRole(role?: string | null) {
  return role === "KADER";
}
