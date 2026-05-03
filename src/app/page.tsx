import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActivitySlider from "@/components/ActivitySlider";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const latestPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const upcomingActivities = await prisma.activity.findMany({
    where: { published: true, scope: "PUBLIC", startDate: { gte: new Date() } },
    orderBy: { startDate: "asc" },
    take: 5,
  });

  const pastActivities = await prisma.activity.findMany({
    where: { published: true, scope: "PUBLIC", startDate: { lt: new Date() } },
    orderBy: { startDate: "desc" },
    take: 5,
  });

  const latestActivities = [...upcomingActivities, ...pastActivities].slice(0, 5);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 md:py-32 relative overflow-hidden">
        {/* Background Pattern Enhancement */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent opacity-10 skew-x-12 translate-x-20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold text-accent mb-2 uppercase tracking-wider">
              PC PMII KOTA BALIKPAPAN
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Dzikir, Fikir, dan <span className="text-accent">Amal Shaleh</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
              Selamat datang di Website Resmi Pengurus Cabang Pergerakan Mahasiswa Islam Indonesia (PMII) Kota Balikpapan. Wadah kaderisasi mahasiswa islam yang berlandaskan Ahlussunnah wal Jamaah.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/profil"
                className="bg-accent text-primary px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition flex items-center"
              >
                Tentang Kami <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/berita"
                className="bg-white/10 text-white border border-white/30 px-8 py-3 rounded-full font-bold hover:bg-white/20 transition backdrop-blur-sm"
              >
                Baca Berita
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Singkat */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4 relative">
              Sejarah Singkat <span className="absolute bottom-1 left-0 w-1/3 h-2 bg-accent/30 -z-10"></span>
            </h2>
            <p className="text-secondary leading-relaxed text-justify">
              Pergerakan Mahasiswa Islam Indonesia (PMII) lahir dari kegelisahan mahasiswa Nahdlatul Ulama yang ingin memiliki wadah pergerakan yang independen namun tetap berpegang teguh pada nilai-nilai Ahlussunnah wal Jamaah. PMII didirikan pada tanggal 17 April 1960 di Surabaya. Sejak kelahirannya, PMII berkomitmen untuk mempertahankan dan mengamalkan Pancasila serta UUD 1945. Di Balikpapan, PMII terus tumbuh menjadi organisasi yang kritis, inovatif, dan berkontribusi nyata bagi pembangunan daerah maupun nasional.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
            {/* Placeholder for Historical Image */}
            <span className="text-gray-400 font-medium">Foto Sejarah / Dokumentasi PMII</span>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-12">Visi & Misi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Visi */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Visi</h3>
              <p className="text-secondary leading-relaxed">
                Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah SWT, berbudi luhur, berilmu, cakap dan bertanggung jawab dalam mengamalkan ilmunya serta komitmen memperjuangkan cita-cita kemerdekaan Indonesia.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transform hover:-translate-y-1 transition duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Misi</h3>
              <ul className="text-secondary text-left space-y-2 list-disc list-inside">
                <li>Komitmen terhadap nilai-nilai keislaman Ahlussunnah wal Jamaah.</li>
                <li>Memperjuangkan keadilan dan kesejahteraan sosial.</li>
                <li>Mengembangkan intelektualitas dan profesionalitas kader.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Dasar Pergerakan (NDP) */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Nilai Dasar Pergerakan</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Landasan berfikir, bersikap, dan bertindak setiap kader PMII dalam kehidupan sehari-hari maupun organisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Tauhid", desc: "Mengesakan Allah SWT sebagai sumber dari segala sumber kebenaran.", color: "bg-blue-600" },
            { title: "Hablum Minallah", desc: "Menjaga hubungan vertikal dengan Allah SWT melalui ibadah dan ketaqwaan.", color: "bg-green-600" },
            { title: "Hablum Minannas", desc: "Menjaga hubungan baik antar sesama manusia dengan prinsip egaliter dan persaudaraan.", color: "bg-yellow-500" },
            { title: "Hablum Minal Alam", desc: "Menjaga kelestarian alam semesta sebagai tempat hidup dan beribadah.", color: "bg-red-500" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
              <div className={`h-2 ${item.color}`}></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-2 group-hover:text-accent transition">{item.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights / News Preview */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Kabar Terbaru</h2>
            <div className="h-1 w-20 bg-accent rounded"></div>
          </div>
          <Link href="/berita" className="text-primary hover:text-accent font-medium flex items-center">
            Lihat Semua <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl text-gray-400">
              Belum ada berita terbaru.
            </div>
          ) : (
            latestPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {post.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Berita
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-xs text-secondary mb-3 space-x-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition line-clamp-2">
                    <Link href={`/berita/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-secondary text-sm line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <Link href={`/berita/${post.slug}`} className="text-primary font-bold text-sm hover:underline">
                    Baca Selengkapnya
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Informas & Kegiatan - Dynamic Slider */}
      <section className="bg-gray-50/50 py-24 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 relative inline-block">
                Informasi & Kegiatan
                <span className="absolute -bottom-2 left-0 w-1/2 h-2 bg-accent/50 rounded-full"></span>
              </h2>
              <p className="text-xl text-secondary leading-relaxed">
                Ikuti perkembangan kegiatan PMII Balikpapan. Mulai dari pelatihan kaderisasi hingga aksi kemanusiaan.
              </p>
            </div>
            
            <Link href="/kegiatan" className="group flex items-center bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-sm hover:shadow-md transition border border-primary/5">
              Lihat Agenda Lengkap 
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* DYNAMIC SLIDER COMPONENT */}
          <ActivitySlider kegiatan={latestActivities} />
          
          {/* E-Learning CTA Banner */}
          <div className="mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] border border-primary/5 shadow-lg shadow-blue-900/5 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <BookOpen className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-primary mb-2">E-Learning Kader</h4>
                  <p className="text-secondary leading-relaxed max-w-xl text-lg">
                    Akses materi modul MAPABA dan PKD secara digital melalui sistem manajemen belajar terpadu kami.
                  </p>
               </div>
            </div>
            <Link href="/materi" className="shrink-0 group/btn relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-primary rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative flex items-center gap-2">Mulai Belajar <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Registration - ONLY for Public (Not logged in) */}
      {!session && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bergabung Bersama PMII</h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                Jadilah bagian dari mahasiswa pergerakan yang siap membawa perubahan positif bagi bangsa dan agama.
              </p>
              <Link
                href="/daftar"
                className="inline-block bg-accent text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
