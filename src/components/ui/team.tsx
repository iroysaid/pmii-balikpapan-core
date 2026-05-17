"use client";

import Image from "next/image";
import { UserStar } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";

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

export default function Component() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-24">
      <svg
        className="absolute bottom-0 right-0 text-primary/10"
        fill="none"
        height="154"
        viewBox="0 0 460 154"
        width="460"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#teamClip)">
          <path
            d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="40"
          />
        </g>
        <defs>
          <clipPath id="teamClip">
            <rect fill="white" height="154" width="460" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 flex max-w-5xl flex-col items-center px-6 text-center lg:px-0">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <UserStar className="h-6 w-6" />
          </div>

          <h2 className="relative mb-4 text-4xl font-medium tracking-normal text-neutral-900 sm:text-5xl">
            Pengurus PMII Balikpapan
            <svg
              className="absolute -right-8 -top-2 -z-10 w-24 text-accent/30"
              fill="currentColor"
              height="86"
              viewBox="0 0 108 86"
              width="108"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.8484 16.236L15 43.5793L78.2688 15L18.1218 71L93 34.1172L70.2047 65.2739"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="28"
              />
            </svg>
          </h2>
          <p className="max-w-2xl text-neutral-600">
            Wajah penggerak organisasi yang merawat kaderisasi, literasi,
            advokasi, dan pelayanan anggota di Kota Balikpapan.
          </p>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent" />

          <Marquee className="[--gap:1.5rem]" pauseOnHover>
            {teamMembers.map((member) => (
              <div className="group flex w-64 shrink-0 flex-col" key={member.name}>
                <div className="relative h-[23rem] w-full overflow-hidden rounded-2xl bg-neutral-100">
                  <Image
                    alt={member.name}
                    className="object-cover grayscale transition-all duration-300 hover:grayscale-0"
                    fill
                    sizes="256px"
                    src={member.image}
                  />
                  <div className="absolute bottom-0 w-full rounded-lg bg-white/85 p-3 backdrop-blur">
                    <h3 className="font-semibold text-neutral-900">{member.name}</h3>
                    <p className="text-sm text-neutral-600">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        <div className="mx-auto mt-20 max-w-3xl px-6 text-center lg:px-0">
          <p className="mb-8 text-lg font-medium leading-relaxed text-neutral-900 md:text-xl">
            Bergerak bersama kader berarti membangun disiplin ilmu, keberanian
            sosial, dan adab organisasi yang hidup dalam keseharian.
          </p>
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full">
              <Image
                alt="Forum kader PMII"
                className="object-cover"
                fill
                sizes="56px"
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=300&auto=format&fit=crop"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-neutral-900">PC PMII Balikpapan</p>
              <p className="text-sm text-neutral-600">Dzikir, Fikir, Amal Shaleh</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
