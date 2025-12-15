import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role;

        // Kader Access Control
        if (role === "KADER") {
            // Preventing access to admin routes
            // Allowed: /dashboard/member, /dashboard/learning, /dashboard/finance (User request)
            // Blocked: /dashboard (root), /dashboard/kader (list from sidebar logic, though arguably they might see it?)
            // Actually, keep blocking 'kader' user management and 'surat' (Administrasi) for Kader.
            const blockedPrefixes = ["/dashboard/kader", "/dashboard/surat", "/admin"];
            const isBlocked = blockedPrefixes.some(prefix => path.startsWith(prefix)) || path === "/dashboard";

            if (isBlocked) {
                return NextResponse.redirect(new URL("/dashboard/member", req.url));
            }
        }

        // Pengurus Access Control
        // Pengurus can access everything but read-only (handled by page logic), so no redirect needed except maybe preventing Access to Member dashboard if strictly separate?
        // For now, let Pengurus access everything.
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
