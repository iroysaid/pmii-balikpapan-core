import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { hasAccess } from "@/lib/permissions/defaults";
import { getRolePermissions } from "@/lib/permissions/routes";
import type {
  AccessLevel,
  DashboardPermissionKey,
} from "@/lib/permissions/types";

export async function requireDashboardPermission(
  permission: DashboardPermissionKey,
  minimum: AccessLevel = "view"
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    throw new Error("Unauthorized");
  }

  if (session.user.role === "SUPER_ADMIN") {
    return session;
  }

  const rolePermissions = getRolePermissions(session.user.role);
  const permissions = session.user.permissions || rolePermissions;

  if (!hasAccess(permissions[permission] || rolePermissions[permission], minimum)) {
    throw new Error("Unauthorized: insufficient permissions.");
  }

  return session;
}
