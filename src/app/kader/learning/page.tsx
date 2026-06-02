import Link from "next/link";
import { getServerSession } from "next-auth";
import { Lock, PlayCircle } from "lucide-react";

import { updateLearningPathProgress } from "@/app/actions/member";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function LearningJourneyPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);
  const pathStatus = new Map(data.learningPath.map((item) => [item.title, item.status]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Learning Journey</p>
        <h1 className="mt-2 text-3xl font-black text-[#122562]">Jalur belajar kader</h1>
        <p className="mt-2 max-w-2xl text-secondary/70">
          Modul dasar, menengah, dan lanjutan disusun mengikuti jenjang MAPABA, PKD, PKL, dan PKN.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.learningPath.map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
              {item.status === "LOCKED" ? <Lock className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
            </div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{item.path}</p>
            <h2 className="mt-2 text-2xl font-black text-[#122562]">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary/70">{item.description}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-50">
              <div className="h-full rounded-full bg-primary" style={{ width: `${item.progress}%` }} />
            </div>
            <p className="mt-2 text-sm font-black text-primary">{item.progress}% selesai</p>
            {item.status !== "LOCKED" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={updateLearningPathProgress}>
                  <input type="hidden" name="path" value={item.title} />
                  <input type="hidden" name="progress" value={Math.max(item.progress, 25)} />
                  <input type="hidden" name="status" value="IN_PROGRESS" />
                  <button className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-primary">
                    Mulai
                  </button>
                </form>
                <form action={updateLearningPathProgress}>
                  <input type="hidden" name="path" value={item.title} />
                  <input type="hidden" name="progress" value="100" />
                  <input type="hidden" name="status" value="DONE" />
                  <button className="rounded-full bg-primary px-4 py-2 text-xs font-black text-white">
                    Tandai Selesai
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      <SectionCard title="Modul tersedia" description="Materi publik dan private yang sudah dipublish admin learning management.">
        <div className="grid gap-3 md:grid-cols-2">
          {data.materials.map((material) => {
            const isLocked = pathStatus.get(material.pathKey) === "LOCKED";
            const progress = material.learningProgress[0]?.progress || 0;

            if (isLocked) {
              return (
                <div key={material.id} className="rounded-2xl bg-gray-50 p-4 opacity-70">
                  <p className="flex items-center gap-2 font-black text-secondary">
                    <Lock className="h-4 w-4" />
                    {material.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-secondary/60">Terkunci sampai path sebelumnya selesai.</p>
                </div>
              );
            }

            return (
              <Link key={material.id} href={`/kader/learning/${material.id}`} className="rounded-2xl bg-blue-50 p-4 transition hover:bg-blue-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-primary">{material.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-secondary/70">{material.description || "Materi pembelajaran kader."}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-primary">{progress}%</span>
                </div>
              </Link>
            );
          })}
          {data.materials.length === 0 && <p className="text-sm text-secondary/60">Belum ada modul yang dipublish.</p>}
        </div>
      </SectionCard>
    </div>
  );
}
