"use client";

import Link from "next/link";
import type { FooterContent } from "@/lib/landing/types";

export default function Footer({ content }: { content: FooterContent }) {
    return (
        <footer className="mt-auto border-t border-accent/40 bg-secondary py-10 text-white">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 text-accent flex items-center space-x-2">
                        <span>{content.brand}</span>
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                        {content.tagline}
                    </p>
                    <div className="flex space-x-4">
                        {content.socials.map((social) => (
                            <a
                                key={social.href}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:border-accent hover:bg-accent hover:text-secondary"
                            >
                                {social.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4">Tautan Cepat</h4>
                    <ul className="space-y-2 text-sm">
                        {content.quickLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="hover:text-accent transition">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4">{content.secretariatTitle}</h4>
                    <ul className="text-sm space-y-4 text-white/80">
                        <li>
                            <p className="font-bold text-white mb-1">{content.addressLabel}</p>
                            {content.address}
                        </li>
                        <li>
                            <a
                                href={content.mapsCta.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex rounded-full bg-accent px-4 py-2 font-bold text-secondary transition hover:bg-white"
                            >
                                {content.mapsCta.label}
                            </a>
                        </li>
                        <li>Email: {content.email}</li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs text-white/65 mt-10 pt-4 border-t border-accent/30">
                {content.copyright}
            </div>
        </footer>
    );
}
