"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
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
    const isKaderDashboard = pathname.startsWith("/kader");
    const isStandaloneLanding = pathname.startsWith("/pmii");

    return (
        <>
            {!isDashboard && !isKaderDashboard && !isStandaloneLanding && <Navbar content={navbar} />}
            <main className={`flex-grow ${!isDashboard && !isKaderDashboard ? "pb-24 md:pb-0" : ""}`}>
                {children}
            </main>
            {!isDashboard && !isKaderDashboard && <Footer content={footer} />}
            {!isDashboard && !isKaderDashboard && !isStandaloneLanding && <MobileBottomNav />}
        </>
    );
}
