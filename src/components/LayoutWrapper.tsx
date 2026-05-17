"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");
    const isStandaloneLanding = pathname.startsWith("/pmii");

    return (
        <>
            {!isDashboard && !isStandaloneLanding && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!isDashboard && <Footer />}
        </>
    );
}
