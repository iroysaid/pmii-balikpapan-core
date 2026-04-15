"use client";

import { useState } from "react";
import { submitRSVP } from "@/app/actions/rsvp";
import { Loader2, CheckCircle2, User, MessageCircle, Heart } from "lucide-react";

interface RSVPFormProps {
    activityId: string;
}

export default function RSVPForm({ activityId }: RSVPFormProps) {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        
        const result = await submitRSVP(formData);
        
        if (result?.success) {
            setSubmitted(true);
        } else {
            setError(result?.error || "Gagal mengirim konfirmasi.");
        }
        setLoading(true); // Keep spinner for a bit for feel
        setTimeout(() => setLoading(false), 800);
    }

    if (submitted) {
        return (
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center space-y-4 animate-in zoom-in-95">
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-white">Terima Kasih!</h3>
                <p className="text-white/70">Konfirmasi kehadiran Anda telah tersimpan. Sampai jumpa di lokasi!</p>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/20 space-y-6">
            <input type="hidden" name="activityId" value={activityId} />
            
            <div className="text-center space-y-2 mb-4">
                <h3 className="text-2xl font-black text-white">Konfirmasi Kehadiran</h3>
                <p className="text-white/60 text-sm">Bantu kami mempersiapkan acara dengan mengonfirmasi kehadiran Anda.</p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Nama Lengkap" 
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <label className="relative cursor-pointer group">
                        <input type="radio" name="attendance" value="HADIR" defaultChecked className="sr-only peer" />
                        <div className="py-4 text-center rounded-2xl bg-white/5 border border-white/10 text-white/60 peer-checked:bg-white/20 peer-checked:text-white peer-checked:border-white/40 transition font-bold text-sm">
                            Saya Hadir
                        </div>
                    </label>
                    <label className="relative cursor-pointer group">
                        <input type="radio" name="attendance" value="TIDAK_HADIR" className="sr-only peer" />
                        <div className="py-4 text-center rounded-2xl bg-white/5 border border-white/10 text-white/60 peer-checked:bg-white/10 peer-checked:text-white/40 transition font-bold text-sm">
                            Ihalangan
                        </div>
                    </label>
                </div>

                <div className="relative">
                    <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                    <textarea 
                        name="message" 
                        placeholder="Pesan/Harapan (Opsional)" 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition min-h-[100px]"
                    />
                </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-white text-primary font-black text-lg hover:bg-white/90 active:scale-95 transition flex items-center justify-center shadow-xl shadow-white/10"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Kirim Konfirmasi <Heart className="w-5 h-5 ml-2 fill-current" /></>}
            </button>
        </form>
    );
}
