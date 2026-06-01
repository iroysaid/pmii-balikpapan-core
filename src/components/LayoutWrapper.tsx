"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { FooterContent, NavbarContent } from "@/lib/landing/types";

export default function LayoutWrapper({
    children,
    footer,
    navbar,
}: {
    children: React.ReactNode;
    footer: FooterContent;
    navbar: NavbarContent;
}) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");
    const isStandaloneLanding = pathname.startsWith("/pmii");

    return (
        <>
            {!isDashboard && !isStandaloneLanding && <Navbar content={navbar} />}
            <main className="flex-grow">{children}</main>
            {!isDashboard && <Footer content={footer} />}
        </>
    );
}
