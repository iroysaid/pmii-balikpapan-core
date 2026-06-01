import "next-auth";
import type {
  AccessLevel,
  DashboardPermissionKey,
} from "@/lib/permissions/types";

type DashboardPermissions = Partial<Record<DashboardPermissionKey, AccessLevel>>;

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
      permissions?: DashboardPermissions;
    };
  }

  interface User {
    role?: string;
    organizationId?: string | null;
    mustChangePassword?: boolean;
    permissions?: DashboardPermissions;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    organizationId?: string | null;
    mustChangePassword?: boolean;
    permissions?: DashboardPermissions;
  }
}
