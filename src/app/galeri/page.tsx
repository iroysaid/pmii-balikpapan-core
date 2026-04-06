import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Calendar } from "lucide-react";

export default async function GalleryPage() {
  const kegiatanWithPhotos = await prisma.activity.findMany({
    where: {
      photos: {
        some: {}
      }
    },
    include: {
      _count: {
        select: { photos: true }
      }
    },
    orderBy: { eventDate: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-4xl mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-primary mb-6">Galeri Pergerakan</h1>
        <p className="text-xl text-secondary leading-relaxed">
          Dokumentasi jejak langkah dan kegiatan PC PMII Kota Balikpapan dari waktu ke waktu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kegiatanWithPhotos.length === 0 ? (
          <div className="col-span-3 py-20 text-center bg-gray-50 rounded-3xl text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Belum ada album dokumentasi yang tersedia.</p>
          </div>
        ) : (
          kegiatanWithPhotos.map((album) => (
            <Link 
              key={album.id} 
              href={`/galeri/${album.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                {album.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={album.image} 
                    alt={album.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  {album._count.photos} Foto
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-secondary mb-3">
                  <Calendar className="w-3 h-3 mr-2" />
                  {new Date(album.eventDate).toLocaleDateString("id-ID", { month: 'long', year: 'numeric' })}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition">
                  {album.title}
                </h3>
                <p className="text-sm text-secondary line-clamp-2 mb-4">
                  {album.description}
                </p>
                <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm">
                  Buka Album <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
