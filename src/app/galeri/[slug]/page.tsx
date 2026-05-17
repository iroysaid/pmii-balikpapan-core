import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const album = await prisma.activity.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!album) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-32">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16">
          <Link 
            href="/galeri" 
            className="inline-flex items-center text-primary font-bold mb-8 hover:text-accent transition group"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-2 transition" />
            Kembali ke Galeri Koleksi
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-secondary">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-primary/5">
                <Calendar className="w-4 h-4 mr-2 text-accent" />
                {new Date(album.eventDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-primary/5">
                <User className="w-4 h-4 mr-2 text-primary" />
                Dikonversi ke WebP & Optimal
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-primary mb-6 leading-tight">
              {album.title}
            </h1>
            
            <p className="text-xl text-secondary leading-relaxed">
              {album.description}
            </p>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.photos.length === 0 ? (
            <div className="col-span-3 py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 font-medium">
              Belum ada foto dokumentasi yang diupload untuk kegiatan ini.
            </div>
          ) : (
            album.photos.map((photo, index) => (
              <div 
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photo.url} 
                  alt={`Dokumentasi ${album.title} - ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                   <div className="text-white">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1">DOKUMENTASI EVENT</p>
                      <p className="font-medium text-sm">Bagian dari {album.title}</p>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
