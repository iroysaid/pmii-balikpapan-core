import { getServerSession } from "next-auth";
import SectionCard from "@/components/kader/SectionCard";
import { authOptions } from "@/lib/auth";
import { getMemberDashboardData } from "@/lib/member/service";

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  const data = await getMemberDashboardData(session!.user.id);

  return (
    <SectionCard title="Pencapaian" description="Badge, prestasi, kontribusi, level kader, dan milestone personal.">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {data.achievements.map((achievement) => (
          <div key={achievement.title} className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">{achievement.level}</p>
            <h2 className="mt-2 text-xl font-black text-[#122562]">{achievement.title}</h2>
            <p className="mt-2 text-sm text-secondary/70">{achievement.description}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

