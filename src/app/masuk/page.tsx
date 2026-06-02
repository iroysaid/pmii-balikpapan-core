"use client";

import { getSession, signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackParam = searchParams.get("callbackUrl");
    const callbackUrl = callbackParam || "/kader";
    const reason = searchParams.get("reason");
    const showSessionNotice =
        reason === "session-expired" || callbackUrl.startsWith("/dashboard");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            identifier,
            password,
            callbackUrl,
        });

        if (result?.error) {
            setError("Username/No. Induk atau sandi salah.");
            setLoading(false);
        } else {
            const nextSession = await getSession();
            const role = nextSession?.user?.role;
            const adminRoles = [
                "SUPER_ADMIN",
                "ADMIN",
                "ADMIN_CABANG",
                "PENGURUS_CABANG",
                "PENGURUS_KOMISARIAT",
                "EDITOR",
                "CONTRIBUTOR",
            ];
            const defaultDestination = role && adminRoles.includes(role) ? "/dashboard" : "/kader";
            router.push(callbackParam ? result?.url || callbackUrl : defaultDestination);
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <Image
                            src="/PMII_BPP.png"
                            alt="Logo PMII"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-primary">Masuk PMII</h1>
                    <p className="text-secondary mt-2">Sistem Administrasi & Kaderisasi</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                {!error && showSessionNotice && (
                    <div className="mb-6 rounded-lg bg-blue-50 p-3 text-center text-sm font-semibold text-primary">
                        Silakan masuk untuk melanjutkan. Jika sebelumnya sudah
                        login, sesi Anda mungkin telah berakhir setelah batas 3 jam.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Username atau No Induk (NIA)</label>
                        <input
                            type="text"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                            placeholder="Contoh: kader_123 atau 2024-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Kata Sandi</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition flex justify-center disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Lupa sandi? Hubungi Admin Cabang.
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <LoginForm />
        </Suspense>
    );
}
