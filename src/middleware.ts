import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { canAccessDashboardPath } from "@/lib/permissions/routes";
import { isAdminWorkspaceRole, isKaderRole } from "@/lib/workspaces";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role as string;
        const permissions = token?.permissions;
        const mustChangePassword = token?.mustChangePassword;
        const hasKaderProfile = Boolean(token?.hasKaderProfile);

        if (path.startsWith("/dashboard") && !canAccessDashboardPath({ path, role, permissions })) {
            return NextResponse.redirect(new URL(isKaderRole(role) ? "/kader" : "/", req.url));
        }

        if (path.startsWith("/kader")) {
            const canUseKaderWorkspace =
                role === "SUPER_ADMIN" || isKaderRole(role) || hasKaderProfile;

            if (!canUseKaderWorkspace) {
                return NextResponse.redirect(new URL(isAdminWorkspaceRole(role) ? "/dashboard" : "/", req.url));
            }
        }

        // Force password change on first login
        if (mustChangePassword && path !== "/ganti-password") {
            return NextResponse.redirect(new URL("/ganti-password", req.url));
        }

        // Allow passing /ganti-password if they don't need to change it?
        if (!mustChangePassword && path === "/ganti-password") {
            return NextResponse.redirect(new URL(isAdminWorkspaceRole(role) ? "/dashboard" : "/kader", req.url));
        }

        if (path.startsWith("/admin") && role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        pages: {
            signIn: "/masuk",
        },
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/kader/:path*", "/admin/:path*", "/ganti-password"],
};
