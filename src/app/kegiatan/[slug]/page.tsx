import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import RegistrationForm from "@/components/RegistrationForm";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = await prisma.activity.findUnique({ where: { slug } });
  
  if (!activity) return { title: "Kegiatan Tidak Ditemukan" };
  
  return {
    title: `${activity.title} | PMII Balikpapan`,
    description: activity.description,
  };
}

export default async function DetailKegiatanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      photos: true,
    }
  });

  if (!activity || !activity.published) {
    notFound();
  }

  const getStatus = (start: Date, end: Date | null) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    if (now < startDate) {
      if (now.toDateString() === startDate.toDateString()) return "HARI_INI";
      return "AKAN_DATANG";
    } else if (now >= startDate && now <= endDate) {
      return "SEDANG_BERLANGSUNG";
    } else {
      return "DOKUMENTASI";
    }
  };

  const status = getStatus(activity.startDate, activity.endDate);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "HARI_INI": return "bg-red-500 text-white animate-pulse shadow-red-500/50";
      case "AKAN_DATANG": return "bg-blue-500 text-white shadow-blue-500/50";
      case "SEDANG_BERLANGSUNG": return "bg-red-500 text-white animate-pulse shadow-red-500/50";
      case "DOKUMENTASI": return "bg-gray-800 text-white shadow-gray-800/50";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getBadgeLabel = (status: string) => {
    switch (status) {
      case "HARI_INI": return "HARI INI";
      case "AKAN_DATANG": return "AKAN DATANG";
      case "SEDANG_BERLANGSUNG": return "SEDANG BERLANGSUNG";
      case "DOKUMENTASI": return "DOKUMENTASI";
      default: return "";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero Poster Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] bg-primary flex items-end">
        {activity.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
                src={activity.image} 
                alt={activity.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-900"></div>
        )}

        <div className="container mx-auto px-4 relative z-10 pb-16">
          <Link href="/kegiatan" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-8 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
             <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Agenda
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
             <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-lg tracking-wider ${getBadgeStyle(status)}`}>
               {getBadgeLabel(status)}
             </span>
             <span className="text-accent font-medium bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                {activity.organizer || "PC PMII Balikpapan"}
             </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
            {activity.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-white/90">
             <div className="flex items-center bg-black/20 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                <Calendar className="w-5 h-5 mr-3 text-accent" />
                <div>
                   <div className="text-xs text-white/50 uppercase font-bold tracking-wider mb-0.5">Tanggal</div>
                   <div className="font-medium text-sm">
                    {new Date(activity.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA
                    {activity.endDate && (
                        <> - {new Date(activity.endDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA</>
                    )}
                   </div>
                </div>
             </div>
             {activity.location && (
                 <div className="flex items-center bg-black/20 px-5 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
                    <MapPin className="w-5 h-5 mr-3 text-red-400" />
                    <div>
                       <div className="text-xs text-white/50 uppercase font-bold tracking-wider mb-0.5">Lokasi</div>
                       <div className="font-medium text-sm">{activity.location}</div>
                    </div>
                 </div>
             )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Description */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-black text-primary mb-6">Tentang Kegiatan</h2>
                    <div className="prose prose-lg prose-blue max-w-none text-secondary leading-relaxed whitespace-pre-line">
                        {activity.description}
                    </div>
                </div>
            </div>

            {/* Sidebar / Info Panel */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-primary mb-6">Informasi Detail</h3>
                    <ul className="space-y-6">
                        <li className="flex items-start">
                            <div className="bg-blue-50 p-3 rounded-xl text-primary shrink-0 mr-4">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Penyelenggara</div>
                                <div className="font-bold text-primary">{activity.organizer || "PC PMII Balikpapan"}</div>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <div className="bg-red-50 p-3 rounded-xl text-red-500 shrink-0 mr-4">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Tempat</div>
                                <div className="font-bold text-primary">{activity.location || "Menunggu Konfirmasi"}</div>
                            </div>
                        </li>
                        {status === "AKAN_DATANG" && (
                             <li className="pt-6 border-t border-gray-100">
                                <RegistrationForm activityId={activity.id} />
                             </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      {/* Gallery Section (Anti-Mainstream Masonry/Collage) */}
      {status === "DOKUMENTASI" && activity.photos.length > 0 && (
          <section className="container mx-auto px-4 mt-24">
              <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl md:text-4xl font-black text-primary flex items-center">
                     <ImageIcon className="w-8 h-8 mr-4 text-accent" />
                     Galeri Dokumentasi
                  </h2>
                  <div className="h-1 flex-1 bg-gray-200 ml-8 rounded-full"></div>
              </div>

              {/* CSS Masonry Layout */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                  {activity.photos.map((photo, i) => (
                      <div 
                        key={photo.id} 
                        className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 bg-white"
                      >
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img 
                            src={photo.url} 
                            alt={`Dokumentasi ${i+1}`}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                         <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/30">
                                PMII Balikpapan
                            </span>
                         </div>
                      </div>
                  ))}
              </div>
          </section>
      )}
    </div>
  );
}
