"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, ImageIcon, ArrowRight } from "lucide-react";

type Activity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  organizer: string | null;
  image: string | null;
  photos: any[];
};

export default function KegiatanClient({ activities }: { activities: Activity[] }) {
  const [filter, setFilter] = useState("SEMUA");

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

  const filteredActivities = activities.filter((activity) => {
    if (filter === "SEMUA") return true;
    const status = getStatus(activity.startDate, activity.endDate);
    if (filter === "AKAN_DATANG" && (status === "AKAN_DATANG" || status === "HARI_INI")) return true;
    if (filter === "SEDANG_BERLANGSUNG" && status === "SEDANG_BERLANGSUNG") return true;
    if (filter === "DOKUMENTASI" && status === "DOKUMENTASI") return true;
    return false;
  });

  // Group by Month and Year
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.startDate);
    const monthYear = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(activity);
    return groups;
  }, {} as Record<string, Activity[]>);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "HARI_INI": return "bg-red-500 text-white animate-pulse";
      case "AKAN_DATANG": return "bg-blue-500 text-white";
      case "SEDANG_BERLANGSUNG": return "bg-red-500 text-white animate-pulse";
      case "DOKUMENTASI": return "bg-gray-800 text-white";
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
    <div className="pb-24">
      {/* Hero Header */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent opacity-10 skew-x-12 translate-x-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Agenda & Aktivitas</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Pantau seluruh jadwal kegiatan, kajian, dan aksi PMII Balikpapan. Temukan juga berbagai dokumentasi momen pergerakan kami.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {["SEMUA", "AKAN_DATANG", "SEDANG_BERLANGSUNG", "DOKUMENTASI"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                filter === tab 
                  ? "bg-primary text-white shadow-lg scale-105" 
                  : "bg-white text-secondary border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Timeline Content */}
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-500">Tidak ada kegiatan ditemukan.</h3>
             <p className="text-gray-400 mt-2">Coba ubah filter di atas.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {Object.entries(groupedActivities).map(([monthYear, acts]) => (
              <div key={monthYear} className="relative">
                <div className="sticky top-0 z-20 py-4 bg-gray-50/90 backdrop-blur-sm">
                  <div className="flex items-center">
                    <h2 className="text-2xl font-black text-primary">{monthYear}</h2>
                    <div className="h-0.5 flex-1 bg-gray-200 ml-6"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                  {acts.map((activity) => {
                    const status = getStatus(activity.startDate, activity.endDate);
                    return (
                      <Link 
                        href={`/kegiatan/${activity.slug}`} 
                        key={activity.id}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                      >
                        <div className="relative h-64 overflow-hidden bg-gray-100">
                          {activity.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={activity.image} 
                                alt={activity.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                No Poster
                            </div>
                          )}
                          
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow-md ${getBadgeStyle(status)}`}>
                              {getBadgeLabel(status)}
                            </span>
                          </div>

                          {status === "DOKUMENTASI" && activity.photos.length > 0 && (
                             <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center shadow-lg">
                                <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> +{activity.photos.length} Foto
                             </div>
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                            {activity.title}
                          </h3>
                          
                          <div className="space-y-2 mb-4 mt-auto">
                            <div className="flex items-center text-sm text-secondary">
                              <Calendar className="w-4 h-4 mr-2 text-accent" />
                              {new Date(activity.startDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                              {activity.endDate && new Date(activity.startDate).toDateString() !== new Date(activity.endDate).toDateString() && (
                                <> - {new Date(activity.endDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</>
                              )}
                            </div>
                            {activity.location && (
                              <div className="flex items-center text-sm text-secondary">
                                <MapPin className="w-4 h-4 mr-2 text-red-400 shrink-0" />
                                <span className="line-clamp-1">{activity.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-500">
                              {activity.organizer || "PC PMII Balikpapan"}
                            </span>
                            <span className="text-primary font-bold flex items-center group-hover:text-accent transition-colors">
                              Detail <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
