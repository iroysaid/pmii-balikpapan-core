import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Galeri | PC PMII Balikpapan",
    description: "Dokumentasi kegiatan dan momen penting PMII Balikpapan.",
};

export default async function GalleryPage() {
    // Fetch Images from Posts
    const postImages = await prisma.post.findMany({
        where: {
            published: true,
            image: { not: null },
        },
        select: {
            id: true,
            title: true,
            image: true,
            slug: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    // Fetch Images from GalleryItem (if populated)
    const galleryItems = await prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Combine and standardize
    // We prioritize GalleryItems as dedicated photos, then Post images as documentation
    const allImages = [
        ...galleryItems.map(item => ({
            id: `gallery-${item.id}`,
            src: item.imageUrl,
            alt: item.title || "Dokumentasi PMII",
            caption: item.description || item.title,
            date: item.createdAt,
            link: null
        })),
        ...postImages.map(post => ({
            id: `post-${post.id}`,
            src: post.image!,
            alt: post.title,
            caption: post.title,
            date: post.createdAt,
            link: `/berita/${post.slug}` // Link to the post
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort combined list by date desc

    return (
        <div className="bg-background min-h-screen py-20">
            {/* Header */}
            <div className="bg-primary text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Kegiatan</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Rekam jejak perjuangan dan kenangan dalam bingkai visual.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {allImages.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-gray-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-500">Belum ada foto yang diunggah.</h3>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {allImages.map((image) => (
                            <div key={image.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 border border-gray-100 group relative">
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-6">
                                        <p className="text-white font-medium text-lg line-clamp-2 drop-shadow-md">
                                            {image.caption}
                                        </p>
                                        <p className="text-gray-300 text-xs mt-1">
                                            {new Date(image.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        {image.link && (
                                            <Link href={image.link} className="inline-block mt-3 text-accent text-sm font-bold hover:underline">
                                                Lihat Berita &rarr;
                                            </Link>
                                        )}
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
