import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role as string;
        const mustChangePassword = token?.mustChangePassword;

        if (path.startsWith("/dashboard") && role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Force password change on first login
        if (mustChangePassword && path !== "/ganti-password") {
            return NextResponse.redirect(new URL("/ganti-password", req.url));
        }

        // Allow passing /ganti-password if they don't need to change it?
        if (!mustChangePassword && path === "/ganti-password") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
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
    matcher: ["/dashboard/:path*", "/admin/:path*", "/ganti-password"],
};
