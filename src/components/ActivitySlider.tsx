"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  location?: string | null;
  image: string | null;
}

export default function ActivitySlider({ kegiatan }: { kegiatan: Activity[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (kegiatan.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === kegiatan.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [kegiatan.length]);

  if (kegiatan.length === 0) {
    return (
      <div className="bg-gray-100 h-64 rounded-2xl flex items-center justify-center text-gray-400">
        Belum ada kegiatan yang terdaftar.
      </div>
    );
  }

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? kegiatan.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === kegiatan.length - 1 ? 0 : prev + 1));

  const active = kegiatan[current];

  // Automated Logic for Status
  const getStatusInfo = (start: Date | string, end?: Date | string | null) => {
    // Determine the current time in local timezone (WITA implied by server/client locale or just using Date object normally)
    const now = new Date();
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(startDate);
    
    // Normalize to end of day for end date to cover the whole day
    endDate.setHours(23, 59, 59, 999);

    if (now < startDate) {
      // Check if it's today
      if (now.toDateString() === startDate.toDateString()) {
          return { label: "HARI INI", color: "bg-red-500 text-white" };
      }
      return { label: "AKAN DATANG", color: "bg-primary text-white" };
    } else if (now >= startDate && now <= endDate) {
      return { label: "SEDANG BERLANGSUNG", color: "bg-red-500 text-white animate-pulse" };
    } else {
      return { label: "DOKUMENTASI", color: "bg-gray-600 text-white" };
    }
  };

  const status = getStatusInfo(active.startDate, active.endDate);

  return (
    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden group">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[260px] overflow-hidden sm:h-[320px] lg:h-[450px]">
          {active.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover transition-transform duration-700 scale-105"
              key={`img-${active.id}`}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              No Image Available
            </div>
          )}
          
          <div className="absolute top-6 left-6">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative flex flex-col justify-center bg-white p-6 pb-24 sm:p-8 sm:pb-24 lg:p-12">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500" key={active.id}>
            <div className="flex flex-wrap items-center text-primary/60 mb-4 font-medium gap-4">
                <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-accent" />
                    <span>{new Date(active.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                {active.location && (
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-red-400" />
                        <span className="line-clamp-1 max-w-[200px]">{active.location}</span>
                    </div>
                )}
            </div>
            
            <h3 className="mb-4 line-clamp-2 text-2xl font-black leading-tight text-primary sm:text-3xl lg:mb-6 lg:text-4xl">
              <Link href={`/kegiatan/${active.slug}`} className="hover:text-accent transition">
                {active.title}
              </Link>
            </h3>
            
            <p className="mb-6 line-clamp-3 text-base leading-relaxed text-secondary sm:text-lg lg:mb-8">
              {active.description}
            </p>
            
            <Link href={`/kegiatan/${active.slug}`} className="inline-flex items-center text-primary font-bold hover:text-accent transition group/btn">
              Lihat Detail Kegiatan
              <ChevronRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition" />
            </Link>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-6 right-6 flex gap-3 lg:bottom-8 lg:right-8">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent hover:text-primary transition shadow-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          
          {/* Indicators */}
          <div className="absolute bottom-10 left-6 flex gap-2 lg:bottom-12 lg:left-12">
            {kegiatan.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${current === idx ? 'w-8 bg-accent' : 'w-2 bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
