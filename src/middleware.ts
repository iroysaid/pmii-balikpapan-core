import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role as string;
        const mustChangePassword = token?.mustChangePassword;

        // Force password change on first login
        if (mustChangePassword && path !== "/ganti-password") {
            return NextResponse.redirect(new URL("/ganti-password", req.url));
        }

        // Allow passing /ganti-password if they don't need to change it?
        if (!mustChangePassword && path === "/ganti-password") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Kader Access Control
        if (role === "KADER") {
            // Block admin routes
            const blockedPrefixes = ["/dashboard/kader", "/dashboard/surat", "/dashboard/keuangan/manage", "/admin"];
            const isBlocked = blockedPrefixes.some(prefix => path.startsWith(prefix)) || path === "/dashboard";

            if (isBlocked) {
                return NextResponse.redirect(new URL("/dashboard/anggota", req.url));
            }
        }

        // PUBLIC Access Control
        if (role === "PUBLIC" && path.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/ganti-password"],
};
