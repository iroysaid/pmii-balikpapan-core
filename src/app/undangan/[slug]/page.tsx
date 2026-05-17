import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Countdown from "@/components/invitation/Countdown";
import RSVPForm from "@/components/invitation/RSVPForm";
import MusicPlayer from "@/components/invitation/MusicPlayer";
import { MapPin, Calendar, Bell, Share2, Info } from "lucide-react";
import Link from "next/link";

export default async function InvitationPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ to?: string }>;
}) {
    const { slug } = await params;
    const { to } = await searchParams;

    const activity = await prisma.activity.findUnique({
        where: { slug: slug },
        include: { photos: true },
    });

    if (!activity || !activity.isInvitation) {
        return notFound();
    }

    const eventDateStr = new Date(activity.eventDate).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // Theme Styles
    const themes: Record<string, string> = {
        "modern-blue": "from-primary via-blue-600 to-blue-700 text-white",
        "classic-gold": "from-amber-900 via-yellow-950 to-amber-950 text-white",
        "midnight-dark": "from-slate-950 via-gray-900 to-slate-900 text-white",
    };

    const currentTheme = themes[activity.theme] || themes["modern-blue"];

    return (
        <div className={`min-h-screen bg-gradient-to-b ${currentTheme} selection:bg-white/30`}>
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Blurred Background Image */}
                {activity.image && (
                    <div 
                        className="absolute inset-0 z-0 scale-110 blur-2xl opacity-40"
                        style={{ backgroundImage: `url(${activity.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                )}
                
                <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center space-y-6">
                    <div className="animate-in fade-in zoom-in duration-1000">
                        <img 
                            src="/logo-pmii.png" 
                            alt="PMII Logo" 
                            className="w-20 md:w-28 drop-shadow-2xl mb-4"
                        />
                    </div>
                    
                    <div className="space-y-2 animate-in slide-in-from-bottom-6 duration-700">
                        <p className="text-sm md:text-base font-bold tracking-[0.3em] uppercase opacity-70">Undangan Spesial</p>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-lg leading-tight">
                            {activity.title}
                        </h1>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <p className="text-sm md:text-lg opacity-80 mb-1">Kepada Yth. Sahabat/i</p>
                        <h2 className="text-2xl md:text-4xl font-black capitalize text-white">
                            {to ? to.replace(/\+/g, ' ') : "Rekan Pergerakan"}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-20 pb-20 space-y-12">
                
                {/* Poster / Image */}
                {activity.image && (
                    <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border-4 border-white/10 group">
                        <img 
                            src={activity.image} 
                            alt={activity.title} 
                            className="w-full h-auto group-hover:scale-105 transition duration-700"
                        />
                    </div>
                )}

                {/* Countdown */}
                <div className="space-y-4 text-center">
                    <h3 className="text-xl font-bold opacity-70">Acara Akan Dimulai Dalam</h3>
                    <Countdown targetDate={activity.eventDate} />
                </div>

                {/* Event Details */}
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                    <div className="text-center space-y-4">
                        <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2">
                           <Info className="w-6 h-6" />
                        </div>
                        <p className="text-lg md:text-xl leading-relaxed opacity-90 italic font-medium">
                            "{activity.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold opacity-50 tracking-wider">Waktu & Tanggal</p>
                                <p className="text-lg font-bold">{eventDateStr}</p>
                                <p className="text-sm opacity-70 text-blue-300">Pukul 08:00 WITA - Selesai</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-white/10 rounded-2xl">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold opacity-50 tracking-wider">Lokasi Acara</p>
                                <p className="text-lg font-bold">{activity.locationName || "Lokasi menyusul"}</p>
                                {activity.locationUrl && (
                                    <a 
                                        href={activity.locationUrl} 
                                        target="_blank" 
                                        className="text-sm font-bold text-blue-400 hover:underline flex items-center mt-1"
                                    >
                                        Buka di Google Maps <Share2 className="w-3 h-3 ml-1" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <a 
                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(activity.title)}&dates=${new Date(activity.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(activity.eventDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(activity.description)}&location=${encodeURIComponent(activity.locationName || "")}`}
                            target="_blank"
                            className="w-full flex items-center justify-center bg-white text-primary py-4 rounded-2xl font-black hover:bg-white/90 transition shadow-lg shadow-white/10"
                        >
                            <Bell className="w-5 h-5 mr-2" /> Ingatkan Saya (Google Calendar)
                        </a>
                    </div>
                </div>

                {/* RSVP Section */}
                <RSVPForm activityId={activity.id} />

                {/* Footer */}
                <div className="text-center space-y-6 pt-10">
                    <img src="/logo-pmii.png" alt="" className="w-16 mx-auto opacity-50" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold opacity-40">PC PMII BALIKPAPAN</p>
                        <p className="text-[10px] opacity-30 tracking-widest uppercase">Dibuat dengan bangga oleh Kader PMII Balikpapan</p>
                    </div>
                    <Link href="/" className="inline-block text-xs font-bold px-6 py-3 rounded-full bg-white/5 border border-white/10 opacity-50 hover:opacity-100 transition">
                        Kembali ke Halaman Utama
                    </Link>
                </div>
            </div>

            {/* Background Music */}
            {activity.musicUrl && <MusicPlayer url={activity.musicUrl} />}
        </div>
    );
}
