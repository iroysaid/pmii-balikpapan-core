"use client";

import { useState } from "react";
import { changePassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function GantiPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await changePassword(formData);

        if (res.success) {
            // Force re-login to refresh the session token
            await signOut({ redirect: false });
            router.push("/masuk?message=Password berhasil diubah. Silakan login kembali dengan password baru.");
        } else {
            setError(res.error || "Terjadi kesalahan.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-primary">Ganti Password Wajib</h1>
                    <p className="text-sm text-secondary mt-2">Untuk keamanan, Anda wajib mengganti password default dengan password baru Anda.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Password Baru</label>
                        <input
                            type="password"
                            name="newPassword"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-2">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent outline-none"
                            placeholder="Ulangi password baru"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition flex justify-center disabled:opacity-50"
                    >
                        {loading ? "Menyimpan..." : "Simpan & Lanjutkan Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
