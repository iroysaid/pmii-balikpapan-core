import Image from "next/image";
import { MapPin, Milestone, Target, Users } from "lucide-react";

import { getLandingContent } from "@/lib/landing/service";
import { getProfileContent } from "@/lib/profile/service";

export default async function ProfilPage() {
  const [profile, landingContent] = await Promise.all([
    getProfileContent(),
    getLandingContent(),
  ]);
  const profileMembers = landingContent.team.members
    .filter((member) => member.showOnProfile !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden bg-primary py-20 text-center text-white">
        {profile.hero.image && (
          <Image
            src={profile.hero.image}
            alt={profile.hero.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        )}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-32 translate-x-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 px-4">
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            {profile.hero.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/85 md:text-xl">
            {profile.hero.description}
          </p>
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-[-4rem] px-4">
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-[2.5rem] border-t-8 border-accent bg-white p-10 shadow-xl transition duration-500 hover:-translate-y-2">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Milestone className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-primary">
              {profile.history.title}
            </h3>
            <p className="text-justify text-sm leading-relaxed text-secondary">
              {profile.history.description}
            </p>
          </div>

          <div className="rounded-[2.5rem] border-t-8 border-primary bg-white p-10 shadow-xl transition duration-500 hover:-translate-y-2">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Target className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-primary">
              {profile.visionMission.title}
            </h3>
            <ul className="space-y-3 text-sm text-secondary">
              {profile.visionMission.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="font-bold text-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2.5rem] border-t-8 border-accent bg-white p-10 shadow-xl transition duration-500 hover:-translate-y-2">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mb-4 text-2xl font-black text-primary">
              {profile.values.title}
            </h3>
            <p className="text-justify text-sm leading-relaxed text-secondary">
              {profile.values.description}
            </p>
          </div>
        </div>

        <section className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-primary md:text-4xl">
              {profile.structure.title}
            </h2>
            <div className="mx-auto h-2 w-20 rounded-full bg-accent" />
            <p className="mx-auto mt-4 max-w-2xl text-secondary">
              {profile.structure.description}
            </p>
          </div>

          {profileMembers.length > 0 ? (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-5">
              {profileMembers.map((member) => (
                <article
                  key={`${member.name}-${member.role}`}
                  tabIndex={0}
                  className="group w-[72vw] max-w-[18rem] shrink-0 snap-start overflow-hidden rounded-[1.75rem] border border-secondary/10 bg-white shadow-sm outline-none transition focus:shadow-xl active:scale-[0.99] md:w-auto md:max-w-none"
                >
                  <div className="relative h-80 overflow-hidden bg-secondary/5 md:h-72">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 72vw, 220px"
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
          ) : (
            <div className="w-full rounded-[3rem] border-2 border-dashed border-gray-100 bg-white p-12 py-24 text-center text-gray-400 shadow-lg">
              <Users className="mx-auto mb-6 h-16 w-16 text-gray-200" />
              <p className="text-xl font-bold text-gray-400">
                Data pengurus sedang dalam proses digitalisasi
              </p>
            </div>
          )}
        </section>

        <section>
          <div className="mb-12 text-center uppercase tracking-normal">
            <h4 className="mb-2 text-sm font-black text-accent">
              {profile.secretariat.eyebrow}
            </h4>
            <h2 className="mb-6 text-3xl font-black text-primary md:text-5xl">
              {profile.secretariat.title}
            </h2>
            <div className="mx-auto h-2 w-24 rounded-full bg-primary/10" />
          </div>

          <div className="group relative h-[550px] overflow-hidden rounded-[3rem] border border-gray-100 bg-white p-4 shadow-2xl outline-none transition-all focus-within:ring-4 focus-within:ring-primary/5">
            <iframe
              src={profile.secretariat.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "2rem" }}
              allowFullScreen={true}
              loading="lazy"
              title="Peta Lokasi Sekretariat PMII Balikpapan"
              className="grayscale-[0.1] contrast-[1.05] transition-all duration-700 hover:grayscale-0"
            />

            <div className="absolute bottom-10 left-10 right-10 translate-y-2 rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-2xl backdrop-blur transition duration-500 group-hover:translate-y-0 md:right-auto md:w-80">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary p-3 text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="mb-1 text-sm font-black text-primary">
                    {profile.secretariat.addressTitle}
                  </h5>
                  <p className="text-xs leading-relaxed text-secondary">
                    {profile.secretariat.address}
                  </p>
                  <a
                    href={profile.secretariat.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-block text-[10px] font-black uppercase text-accent transition hover:text-primary"
                  >
                    Buka di Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
