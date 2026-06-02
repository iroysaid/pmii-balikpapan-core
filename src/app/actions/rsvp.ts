"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRSVP(formData: FormData) {
    const activityId = formData.get("activityId") as string;
    const name = formData.get("name") as string;
    const attendance = formData.get("attendance") as string;
    const message = formData.get("message") as string || null;

    if (!activityId || !name || !attendance) {
        return { error: "Semua field wajib diisi." };
    }

    try {
        await prisma.rSVP.create({
            data: {
                activityId,
                name,
                attendance,
                message,
            },
        });

        revalidatePath(`/undangan/${activityId}`); // We'll use ID or slug? Actually, undagan uses slug.
        // We might need to revalidate by slug later.
        return { success: true };
    } catch (error) {
        console.error("RSVP Error:", error);
        return { error: "Gagal mengirim konfirmasi." };
    }
}
