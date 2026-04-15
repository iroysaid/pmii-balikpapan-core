import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function KegiatanPage() {
    const activities = await prisma.activity.findMany({
        orderBy: { eventDate: "desc" },
    });

    return (
        <div className="bg-background min-h-screen pb-20 pt-24">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">Agenda & Kegiatan</h1>
                    <p className="text-secondary text-lg max-w-2xl">
                        Kumpulan agenda dan program kerja PC PMII Balikpapan. Mari bergerak bersama untuk kemajuan bangsa.
                    </p>
                    <div className="w-24 h-2 bg-accent mt-6 rounded-full"></div>
                </div>

                {activities.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Calendar className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">Belum Ada Agenda</h3>
                        <p className="text-secondary">Nantikan update kegiatan PMII selanjutnya di halaman ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activities.map((item) => (
                            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                                <Link href={item.isInvitation ? `/undangan/${item.slug}` : `/kegiatan/${item.id}`} className="block relative aspect-video overflow-hidden bg-gray-100">
                                    {item.banner ? (
                                        <Image 
                                            src={item.banner} 
                                            alt={item.title} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition duration-500" 
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-300">
                                            <Calendar className="w-12 h-12" />
                                        </div>
                                    )}
                                    {item.isInvitation && (
                                        <div className="absolute top-4 right-4 bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                                            Undangan Digital
                                        </div>
                                    )}
                                </Link>
                                
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-xs font-bold text-secondary mb-4">
                                        <div className="flex items-center gap-1.5 bg-blue-50 text-primary px-2.5 py-1 rounded-lg">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {item.eventDate ? new Date(item.eventDate).toLocaleDateString("id-ID", { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                                        </div>
                                        {item.locationName && (
                                            <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                                <span className="truncate">{item.locationName}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-primary mb-4 group-hover:text-accent transition line-clamp-2 leading-tight">
                                        <Link href={item.isInvitation ? `/undangan/${item.slug}` : `/kegiatan/${item.id}`}>
                                            {item.title}
                                        </Link>
                                    </h3>

                                    <p className="text-secondary text-sm line-clamp-2 mb-6 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                        <Link 
                                            href={item.isInvitation ? `/undangan/${item.slug}` : `/kegiatan/${item.id}`} 
                                            className="text-primary font-black text-sm flex items-center group-hover:gap-2 transition-all"
                                        >
                                            Selengkapnya <ArrowRight className="ml-1 w-4 h-4" />
                                        </Link>
                                        <div className="flex items-center text-xs text-gray-400 gap-1 font-medium">
                                            <Clock className="w-3 h-3" />
                                            {item.eventDate ? new Date(item.eventDate).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
