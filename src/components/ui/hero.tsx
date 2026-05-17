"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, CalendarDays, Sparkles } from "lucide-react";

const ArrowGreenLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-[#c49e3a]"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="6"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGreenRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-[#c49e3a]"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="6"
  >
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const ArrowBlack = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-primary"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="5"
  >
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const CircularBadge = () => (
  <Link
    href="/daftar"
    className="relative flex h-28 w-28 rotate-12 cursor-pointer items-center justify-center rounded-full border-[3px] border-black/5 bg-[#c49e3a] shadow-xl transition-transform hover:scale-105 md:h-36 md:w-36"
  >
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path
          id="pmiiCirclePath"
          d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
          fill="none"
        />
        <text
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          fill="#0043ef"
        >
          <textPath href="#pmiiCirclePath" startOffset="0%">
            GABUNG PMII BALIKPAPAN • GABUNG PMII •
          </textPath>
        </text>
      </svg>
    </div>
    <ArrowRight className="h-10 w-10 text-primary" strokeWidth={3} />
  </Link>
);

const statCards = [
  {
    title: "Kaderisasi",
    body: "Ruang bertumbuh untuk dzikir, fikir, dan amal shaleh.",
    icon: Sparkles,
  },
  {
    title: "Literasi",
    body: "Kajian, e-learning, dan diskusi untuk memperkuat nalar kader.",
    icon: BookOpen,
  },
  {
    title: "Gerakan",
    body: "Agenda sosial dan advokasi yang dekat dengan kebutuhan kota.",
    icon: CalendarDays,
  },
];

export const Component = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#0043ef] font-sans text-white selection:bg-[#c49e3a] selection:text-primary">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff16_1px,transparent_1px),linear-gradient(to_bottom,#ffffff16_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute -left-24 top-28 h-64 w-64 rounded-full bg-[#c49e3a]/20 blur-3xl" />

      <nav className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-6 md:px-10 md:py-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-2xl bg-white p-1 shadow-sm">
            <Image
              src="/PMII_BPP.png"
              alt="Logo PMII Balikpapan"
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c49e3a]">
              PC PMII
            </p>
            <p className="text-sm font-black uppercase tracking-[0.18em]">
              Balikpapan
            </p>
          </div>
        </Link>

        <div className="hidden items-center space-x-2 md:flex">
          {[
            ["Profil", "/profil"],
            ["Agenda", "/kegiatan"],
            ["Berita", "/berita"],
            ["Galeri", "/galeri"],
          ].map(([item, href]) => (
            <Link
              href={href}
              key={item}
              className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              {item}
            </Link>
          ))}
        </div>

        <Link
          href="/daftar"
          className="rounded-full border border-white px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-primary md:px-6 md:text-sm"
        >
          Daftar Kader
        </Link>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-32 pt-8 md:pb-48 md:pt-12">
        <div className="relative z-10 mx-auto mb-16 mt-4 flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <div className="relative z-40 flex w-full flex-col items-center space-y-2 md:space-y-4">
            <div className="relative z-30 flex w-full justify-start pl-[8%] md:pl-[18%]">
              <h1
                className="m-0 p-0 text-[clamp(4rem,11vw,150px)] font-black uppercase leading-[0.85] tracking-normal text-[#c49e3a]"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "1px 1px 0 #10204d, 2px 2px 0 #10204d, 3px 3px 0 #10204d, 4px 4px 0 #10204d, 5px 5px 0 #10204d, 6px 6px 0 #10204d, 7px 7px 0 #10204d, 8px 8px 0 #10204d, 9px 9px 0 #10204d, 10px 10px 0 #10204d",
                }}
              >
                PMII
              </h1>
            </div>

            <div className="relative z-20 flex w-full justify-center">
              <h1
                className="m-0 p-0 text-[clamp(3rem,7.8vw,108px)] font-black uppercase leading-[0.85] tracking-normal text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "1px 1px 0 #10204d, 2px 2px 0 #10204d, 3px 3px 0 #10204d, 4px 4px 0 #10204d, 5px 5px 0 #10204d, 6px 6px 0 #10204d, 7px 7px 0 #10204d, 8px 8px 0 #10204d, 9px 9px 0 #10204d, 10px 10px 0 #10204d",
                }}
              >
                BALIKPAPAN
              </h1>
            </div>

            <div className="relative z-10 flex w-full justify-start pl-[12%] md:pl-[28%]">
              <h1
                className="m-0 p-0 text-[clamp(2.8rem,7vw,98px)] font-black uppercase leading-[0.85] tracking-normal text-white"
                style={{
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow:
                    "1px 1px 0 #10204d, 2px 2px 0 #10204d, 3px 3px 0 #10204d, 4px 4px 0 #10204d, 5px 5px 0 #10204d, 6px 6px 0 #10204d, 7px 7px 0 #10204d, 8px 8px 0 #10204d",
                }}
              >
                BERGERAK
              </h1>
            </div>
          </div>

          <p className="relative z-40 mt-10 max-w-2xl text-base font-semibold leading-relaxed text-white/85 md:text-xl">
            Halaman muka baru untuk memperkenalkan kaderisasi, agenda, dan
            semangat pergerakan PC PMII Kota Balikpapan.
          </p>

          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              className="pointer-events-auto absolute bottom-[8%] -left-[18%] z-10 md:-left-[9%]"
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex aspect-[3/3.5] w-40 rotate-[-12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-52">
                <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full border-[3px] border-white/50 bg-[#c49e3a] shadow-inner md:h-24 md:w-24">
                  <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop"
                    alt="Kader PMII berdiskusi"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-sm font-bold text-white md:text-lg">
                  kaderisasi
                </p>
                <p className="mt-1 text-center text-[10px] text-white/80 md:text-xs">
                  ruang belajar bersama
                </p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              className="pointer-events-auto absolute -right-[18%] top-[12%] z-10 md:-right-[9%]"
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="flex aspect-[3/3.5] w-40 rotate-[12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-52">
                <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-full border-[3px] border-white/50 bg-primary shadow-inner md:h-24 md:w-24">
                  <Image
                    src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop"
                    alt="Forum organisasi mahasiswa"
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-sm font-bold text-white md:text-lg">
                  forum kader
                </p>
                <p className="mt-1 text-center text-[10px] text-white/80 md:text-xs">
                  diskusi dan advokasi
                </p>
              </div>
            </motion.div>

            <div className="absolute bottom-[0%] left-[0%] z-20 h-24 w-24 md:left-[10%] md:h-32 md:w-32">
              <ArrowGreenLeft />
            </div>
            <div className="absolute right-[0%] top-[5%] z-20 h-24 w-24 md:right-[8%] md:h-32 md:w-32">
              <ArrowGreenRight />
            </div>
            <div className="pointer-events-auto absolute bottom-[-12%] right-[2%] z-40 md:right-[13%]">
              <CircularBadge />
            </div>
          </div>
        </div>
      </main>

      <section className="relative z-20 mt-auto w-full rounded-t-[2.5rem] bg-white px-6 py-12 text-primary shadow-[0_-20px_50px_rgba(0,0,0,0.2)] md:rounded-t-[3.5rem] md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {statCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                className="relative flex min-h-64 flex-col items-center rounded-[2rem] border border-gray-100 bg-[#f9f7ef] p-8 text-center"
                key={item.title}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-black uppercase leading-tight md:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-primary/65">
                  {item.body}
                </p>
                {index < statCards.length - 1 && (
                  <div className="absolute -right-12 bottom-8 z-30 hidden h-16 w-16 md:block">
                    <ArrowBlack />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
