import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock } from "lucide-react";
import { notFound } from "next/navigation";

export default async function RegistrationStatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: { kaderProfile: true }
    });

    if (!user || !user.kaderProfile) {
        notFound();
    }

    const { status } = user.kaderProfile;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md w-full text-center">
                {status === "VERIFIED" ? (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-primary">Berhasil!</h1>
                        <p className="text-secondary text-lg">
                            Selamat, pendaftaran Anda telah disetujui. Silakan login untuk mengakses dashboard.
                        </p>
                        <Link
                            href="/masuk"
                            className="inline-block w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                        >
                            Login Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                            <Clock className="w-10 h-10" />
                        </div>
                        <h1 className="text-2xl font-bold text-primary">Menunggu Verifikasi Admin</h1>
                        <p className="text-secondary">
                            Data pendaftaran Anda telah diterima dan sedang dalam proses verifikasi oleh Admin. Mohon menunggu konfirmasi selanjutnya.
                        </p>
                        <div className="pt-4 border-t">
                            <Link href="/" className="text-primary font-bold hover:underline">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
