"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  eventDate: Date | string;
  image: string | null;
  status: string;
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

  return (
    <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden group">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[300px] lg:h-[450px] overflow-hidden">
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
          
          {/* Status Badge - Automated Logic */}
          <div className="absolute top-6 left-6">
            {new Date(active.eventDate) > new Date() ? (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg bg-accent text-primary">
                Coming Soon
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg bg-gray-600 text-white">
                Past Event
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500" key={active.id}>
            <div className="flex items-center text-primary/60 mb-4 font-medium">
                <Calendar className="w-5 h-5 mr-3 text-accent" />
                <span>{new Date(active.eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-black text-primary mb-6 leading-tight">
              {active.title}
            </h3>
            
            <p className="text-lg text-secondary leading-relaxed mb-8">
              {active.description}
            </p>
            
            <button className="inline-flex items-center text-primary font-bold hover:text-accent transition group/btn">
              Lihat Detail Kegiatan
              <ChevronRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition" />
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 right-8 flex gap-3">
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
          <div className="absolute bottom-12 left-12 flex gap-2">
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
