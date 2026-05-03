"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function changePassword(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: "Password minimal 6 karakter." };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: "Konfirmasi password tidak cocok." };
    }

    const hashedPassword = await hash(newPassword, 12);

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                password: hashedPassword,
                mustChangePassword: false
            }
        });
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
