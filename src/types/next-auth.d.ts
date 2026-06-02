import "next-auth";
import type {
  AccessLevel,
  DashboardPermissionKey,
  KaderPermissionKey,
} from "@/lib/permissions/types";

type DashboardPermissions = Partial<
  Record<DashboardPermissionKey | KaderPermissionKey, AccessLevel>
>;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      organizationId?: string | null;
      mustChangePassword?: boolean;
      hasKaderProfile?: boolean;
      permissions?: DashboardPermissions;
    };
  }

  interface User {
    role?: string;
    organizationId?: string | null;
    mustChangePassword?: boolean;
    hasKaderProfile?: boolean;
    permissions?: DashboardPermissions;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    organizationId?: string | null;
    mustChangePassword?: boolean;
    hasKaderProfile?: boolean;
    permissions?: DashboardPermissions;
  }
}
