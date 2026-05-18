/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  GraduationCap,
  Handshake,
  Images,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { getServerSession } from "next-auth";

import ActivitySlider from "@/components/ActivitySlider";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const teamMembers = [
  {
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=700&auto=format&fit=crop",
    name: "Ketua Cabang",
    role: "Koordinator Gerakan",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop",
    name: "Sekretaris",
    role: "Administrasi Organisasi",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop",
    name: "Bendahara",
    role: "Tata Kelola Keuangan",
  },
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=700&auto=format&fit=crop",
    name: "Kaderisasi",
    role: "Pengembangan Kader",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop",
    name: "Media",
    role: "Publikasi dan Informasi",
  },
  {
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=700&auto=format&fit=crop",
    name: "Advokasi",
    role: "Kajian dan Aksi",
  },
];

const ndpItems = [
  {
    title: "Tauhid",
    desc: "Mengesakan Allah SWT sebagai sumber dari segala sumber kebenaran.",
  },
  {
    title: "Hablum Minallah",
    desc: "Menjaga hubungan vertikal dengan Allah SWT melalui ibadah dan ketaqwaan.",
  },
  {
    title: "Hablum Minannas",
    desc: "Menjaga hubungan baik antar sesama manusia dengan prinsip egaliter dan persaudaraan.",
  },
  {
    title: "Hablum Minal Alam",
    desc: "Menjaga kelestarian alam semesta sebagai tempat hidup dan beribadah.",
  },
];

const movementCards = [
  {
    title: "Kaderisasi",
    text: "Dibangun untuk bertumbuh bersama.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    icon: GraduationCap,
  },
  {
    title: "Gerakan",
    text: "Berpihak pada masyarakat.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
    icon: Handshake,
  },
  {
    title: "Solidaritas",
    text: "Sahabat dalam satu barisan.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
    icon: Users,
  },
];

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(content: string, limit = 120) {
  const text = stripHtml(content);
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function RotatingStudyButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/materi"
      aria-label="Mulai belajar di E-Learning Kader"
      className={`group relative flex h-24 w-24 shrink-0 rotate-6 items-center justify-center rounded-full bg-white text-secondary shadow-2xl ring-4 ring-white/20 transition hover:rotate-0 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/70 active:scale-95 sm:h-28 sm:w-28 ${className}`}
    >
      <div className="absolute inset-1 motion-safe:animate-[spin_12s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            id="studyCirclePath"
            d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
          />
          <text
            className="text-[8px] font-black uppercase tracking-[0.2em] sm:text-[9px]"
            fill="#122562"
          >
            <textPath href="#studyCirclePath" startOffset="0%">
              MULAI BELAJAR • E-LEARNING KADER •
            </textPath>
          </text>
        </svg>
      </div>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-secondary transition group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
        <BookOpen className="h-6 w-6" />
      </span>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary px-3 pb-5 pt-0 text-white md:px-5 md:pb-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] bg-[size:3.25rem_3.25rem]" />
      <div className="absolute -left-20 top-28 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute -right-20 bottom-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />

      <div className="container relative z-10 mx-auto my-3 flex min-h-[calc(100svh-6.5rem)] flex-col rounded-[2rem] border border-white/15 bg-primary/55 px-4 py-8 shadow-2xl shadow-secondary/20 backdrop-blur-[2px] md:my-5 md:min-h-[calc(100svh-8rem)] md:rounded-[3rem] md:py-12">
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative w-full max-w-6xl text-center">
            <div className="relative z-20 space-y-2 md:space-y-4">
              <div className="flex justify-start pl-[8%] md:pl-[18%]">
                <h1
                  className="text-[clamp(4rem,18vw,10rem)] font-black uppercase leading-[0.83] tracking-normal text-accent"
                  style={{
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    textShadow:
                      "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562, 6px 6px 0 #122562, 7px 7px 0 #122562",
                  }}
                >
                  PMII
                </h1>
              </div>
              <RotatingStudyButton className="absolute right-1 top-0 z-40 h-20 w-20 sm:hidden" />
              <h2
                className="text-[clamp(3rem,12vw,7rem)] font-black uppercase leading-[0.86] tracking-normal"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562, 6px 6px 0 #122562",
                }}
              >
                Balikpapan
              </h2>
              <div className="flex justify-start pl-[14%] md:pl-[30%]">
                <h2
                  className="text-[clamp(2.7rem,11vw,6rem)] font-black uppercase leading-[0.86] tracking-normal"
                  style={{
                    fontFamily: '"Arial Black", Impact, sans-serif',
                    textShadow:
                      "1px 1px 0 #122562, 2px 2px 0 #122562, 3px 3px 0 #122562, 4px 4px 0 #122562, 5px 5px 0 #122562",
                  }}
                >
                  Bergerak
                </h2>
              </div>
            </div>

            <p className="relative z-30 mx-auto mt-8 max-w-2xl text-base font-semibold leading-relaxed text-white/88 md:text-xl">
              Website resmi PC PMII Kota Balikpapan untuk kaderisasi,
              dokumentasi gerakan, kabar organisasi, dan ruang belajar kader.
            </p>

            <div className="relative z-30 mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/daftar"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3 font-black text-secondary shadow-xl transition hover:bg-white"
              >
                Gabung PMII Balikpapan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <RotatingStudyButton className="hidden sm:flex" />
            </div>

            <div className="pointer-events-none absolute inset-0 hidden md:block">
              <div className="absolute -left-8 bottom-[8%] w-44 -rotate-12 rounded-[2rem] border border-white/35 bg-white/15 p-4 shadow-2xl backdrop-blur-md">
                <div className="relative mb-3 h-20 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500&auto=format&fit=crop"
                    alt="Kader PMII berdiskusi"
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
                <p className="text-left text-sm font-black">kaderisasi</p>
                <p className="text-left text-xs text-white/75">ruang belajar bersama</p>
              </div>
              <div className="absolute -right-8 top-[8%] w-44 rotate-12 rounded-[2rem] border border-white/35 bg-white/15 p-4 shadow-2xl backdrop-blur-md">
                <div className="relative mb-3 h-20 overflow-hidden rounded-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500&auto=format&fit=crop"
                    alt="Forum organisasi mahasiswa"
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
                <p className="text-left text-sm font-black">forum kader</p>
                <p className="text-left text-xs text-white/75">diskusi dan advokasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionMissionSection() {
  return (
    <section id="profil" className="bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
            Profil Organisasi
          </p>
          <h2 className="text-3xl font-black leading-tight text-black md:text-5xl">
            Visi Misi
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-[2rem] border border-secondary/10 bg-background p-6 md:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-primary">Visi</h3>
            <p className="text-base leading-relaxed text-secondary md:text-lg">
              Terbentuknya pribadi muslim Indonesia yang bertaqwa kepada Allah
              SWT, berbudi luhur, berilmu, cakap dan bertanggung jawab dalam
              mengamalkan ilmunya serta komitmen memperjuangkan cita-cita
              kemerdekaan Indonesia.
            </p>
          </article>
          <article className="rounded-[2rem] border border-secondary/10 bg-secondary p-6 text-white md:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-secondary">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-accent">Misi</h3>
            <ul className="space-y-4 text-base leading-relaxed text-white/88 md:text-lg">
              <li>Komitmen terhadap nilai-nilai keislaman Ahlussunnah wal Jamaah.</li>
              <li>Memperjuangkan keadilan dan kesejahteraan sosial.</li>
              <li>Mengembangkan intelektualitas dan profesionalitas kader.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function NdpSection() {
  return (
    <section className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-primary md:text-5xl">
            Nilai Dasar Pergerakan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary md:text-lg">
            Landasan berfikir, bersikap, dan bertindak setiap kader PMII dalam
            kehidupan sehari-hari maupun organisasi.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ndpItems.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-secondary/10 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-black text-secondary">
                {index + 1}
              </div>
              <h3 className="mb-3 text-xl font-black text-primary">{item.title}</h3>
              <p className="text-sm leading-relaxed text-secondary">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="overflow-hidden bg-white px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
              Struktur
            </p>
            <h2 className="text-3xl font-black text-black md:text-5xl">
              Pengurus PMII Balikpapan
            </h2>
          </div>
          <p className="max-w-xl text-secondary">
            Default grayscale, lalu tampil warna asli saat hover, focus, atau
            sentuhan. Di mobile, geser ke samping untuk melihat semua pengurus.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-6">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              tabIndex={0}
              className="group w-[72vw] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-secondary/10 bg-white shadow-sm outline-none transition focus-within:shadow-xl focus:shadow-xl active:scale-[0.99] md:w-auto md:max-w-none"
            >
              <div className="relative h-80 overflow-hidden bg-secondary/5 md:h-72">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 72vw, 180px"
                  className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-focus:grayscale-0 group-active:grayscale-0"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-black text-black">{member.name}</h3>
                <p className="mt-1 text-sm text-secondary">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocumentationSection({
  galleryItems,
}: {
  galleryItems: { id: string; slug: string; title: string; image: string | null; photos: { id: string; url: string }[] }[];
}) {
  const photoTiles = galleryItems
    .flatMap((activity) =>
      activity.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        title: activity.title,
        slug: activity.slug,
      }))
    )
    .slice(0, 6);

  return (
    <section id="galeri" className="bg-background px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
              Dokumentasi
            </p>
            <h2 className="text-3xl font-black text-black md:text-5xl">
              Jejak Kegiatan PMII
            </h2>
          </div>
          <Link
            href="/galeri"
            className="inline-flex items-center font-black text-primary hover:text-secondary"
          >
            Buka Galeri
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {photoTiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {photoTiles.map((photo, index) => (
              <Link
                key={photo.id}
                href={`/galeri/${photo.slug}`}
                className={`group relative overflow-hidden rounded-[1.5rem] bg-secondary/10 ${
                  index === 0 ? "col-span-2 row-span-2 aspect-square md:col-span-2" : "aspect-square"
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-secondary/20 bg-white p-8 text-center text-secondary">
            <Images className="mx-auto mb-4 h-10 w-10 text-primary" />
            Dokumentasi kegiatan akan tampil otomatis setelah foto diunggah.
          </div>
        )}

        <div className="mt-7 text-center">
          <Link
            href="/galeri"
            className="inline-flex rounded-full bg-primary px-7 py-3 font-black text-white transition hover:bg-secondary"
          >
            Lihat Lainnya
          </Link>
        </div>
      </div>
    </section>
  );
}

function MovementSection() {
  return (
    <section className="bg-secondary">
      {movementCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <article
            key={card.title}
            className="relative flex min-h-[100svh] items-end overflow-hidden text-white"
          >
            <div
              className="absolute inset-0 bg-cover bg-center motion-reduce:bg-scroll md:bg-fixed"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/65 to-primary/20" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
            <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-4 py-12 md:py-20">
              <div className="max-w-3xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xl">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="mb-4 font-mono text-sm font-black uppercase tracking-[0.24em] text-accent">
                  0{index + 1} / 03
                </p>
                <h2 className="text-[clamp(3.5rem,15vw,10rem)] font-black uppercase leading-[0.85] tracking-normal">
                  {card.title}
                </h2>
                <p className="mt-6 max-w-2xl text-2xl font-semibold leading-tight text-white/90 md:text-4xl">
                  {card.text}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const [latestPosts, upcomingActivities, pastActivities, galleryItems] =
    await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.activity.findMany({
        where: { published: true, scope: "PUBLIC", startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: 5,
      }),
      prisma.activity.findMany({
        where: { published: true, scope: "PUBLIC", startDate: { lt: new Date() } },
        orderBy: { startDate: "desc" },
        take: 5,
      }),
      prisma.activity.findMany({
        where: { published: true, photos: { some: {} } },
        include: { photos: { take: 4, orderBy: { createdAt: "desc" } } },
        orderBy: { startDate: "desc" },
        take: 4,
      }),
    ]);

  const latestActivities = [...upcomingActivities, ...pastActivities].slice(0, 5);

  return (
    <div className="bg-background">
      <HeroSection />
      <VisionMissionSection />
      <NdpSection />
      <TeamSection />
      <DocumentationSection galleryItems={galleryItems} />
      <MovementSection />

      <section id="berita" className="bg-white px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
                Kabar Terbaru
              </p>
              <h2 className="text-3xl font-black text-black md:text-5xl">
                Kabar Terbaru
              </h2>
            </div>
            <Link
              href="/berita"
              className="inline-flex shrink-0 items-center font-black text-primary hover:text-secondary"
            >
              Lihat Semua
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-secondary/20 p-8 text-center text-secondary">
              Belum ada berita terbaru.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-12">
              <article className="group overflow-hidden rounded-[2rem] border border-secondary/10 bg-white shadow-sm lg:col-span-7">
                <Link href={`/berita/${latestPosts[0].slug}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary/10 md:aspect-[16/10]">
                    {latestPosts[0].image ? (
                      <img
                        src={latestPosts[0].image}
                        alt={latestPosts[0].title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-primary text-2xl font-black text-white">
                        PMII
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-wider text-secondary">
                      Headline
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-secondary/70">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {new Date(latestPosts[0].createdAt).toLocaleDateString("id-ID")}
                    </div>
                    <h3 className="text-3xl font-black leading-tight text-black transition group-hover:text-primary md:text-5xl">
                      {latestPosts[0].title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
                      {excerpt(latestPosts[0].content, 180)}
                    </p>
                    <span className="mt-6 inline-flex items-center font-black text-primary">
                      Baca Headline
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </article>

              <div className="grid gap-5 lg:col-span-5">
                {latestPosts.slice(1, 4).map((post, index) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-[1.5rem] border border-secondary/10 bg-background shadow-sm transition hover:bg-white"
                  >
                    <Link href={`/berita/${post.slug}`} className="grid gap-4 p-4 sm:grid-cols-[9rem_1fr]">
                      <div className="relative aspect-video overflow-hidden rounded-[1.1rem] bg-secondary/10 sm:aspect-square">
                        {post.image ? (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-primary">
                            PMII
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="mb-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-primary">
                          Populer 0{index + 1}
                        </p>
                        <h3 className="line-clamp-2 text-xl font-black leading-tight text-black transition group-hover:text-primary">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-secondary">
                          {excerpt(post.content, 95)}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <section id="agenda" className="bg-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-primary">
                Informasi Kegiatan
              </p>
              <h2 className="text-3xl font-black text-black md:text-5xl">
                Informasi Kegiatan
              </h2>
            </div>
            <Link
              href="/kegiatan"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-black text-primary shadow-sm transition hover:bg-primary hover:text-white"
            >
              Lihat Agenda Lengkap
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <ActivitySlider kegiatan={latestActivities} />

          <div className="mt-10 rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-primary">E-Learning Kader</h3>
                  <p className="mt-2 max-w-xl text-secondary">
                    Akses pedoman, modul MAPABA, dan materi pendalaman kader
                    melalui ruang belajar digital.
                  </p>
                </div>
              </div>
              <Link
                href="/materi"
                className="inline-flex justify-center rounded-full bg-primary px-7 py-3 font-black text-white transition hover:bg-secondary"
              >
                Mulai Belajar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {!session && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-primary p-7 text-center text-white md:p-14">
            <h2 className="text-3xl font-black md:text-5xl">
              Bergabung Bersama PMII
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/85">
              Jadilah bagian dari mahasiswa pergerakan yang siap belajar,
              berorganisasi, dan mengabdi untuk masyarakat.
            </p>
            <Link
              href="/daftar"
              className="mt-7 inline-flex rounded-full bg-accent px-8 py-4 font-black text-secondary transition hover:bg-white"
            >
              Daftar Sekarang
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
