import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import KaderShell from "@/components/kader/KaderShell";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminWorkspaceRole, isKaderRole } from "@/lib/workspaces";

export default async function KaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/masuk?callbackUrl=/kader");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { kaderProfile: true },
  });

  const canUseKaderWorkspace =
    session.user.role === "SUPER_ADMIN" ||
    isKaderRole(session.user.role) ||
    Boolean(user?.kaderProfile);

  if (!canUseKaderWorkspace) {
    redirect(isAdminWorkspaceRole(session.user.role) ? "/dashboard" : "/");
  }

  return (
    <KaderShell
      user={{
        name: user?.name || session.user.name,
        role: session.user.role,
        image: user?.image,
        hasAdminWorkspace: isAdminWorkspaceRole(session.user.role),
      }}
    >
      {children}
    </KaderShell>
  );
}

