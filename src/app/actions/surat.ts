"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LetterType } from "@prisma/client";

async function checkSuperAdmin() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can perform this action.");
    }
}

export async function createLetter(formData: FormData) {
    await checkSuperAdmin();

    const number = formData.get("number") as string;
    const subject = formData.get("subject") as string;
    const type = formData.get("type") as LetterType; // MASUK or KELUAR
    const sender = formData.get("sender") as string; // Only for MASUK
    const receiver = formData.get("receiver") as string; // Only for KELUAR
    const dateStr = formData.get("date") as string;

    const file = formData.get("file") as File;
    let fileUrl = null;

    if (file && file.size > 0) {
        fileUrl = await uploadFile(file, "surat");
    }

    await prisma.letter.create({
        data: {
            number,
            subject,
            type,
            sender: type === "MASUK" ? sender : null,
            receiver: type === "KELUAR" ? receiver : null,
            date: new Date(dateStr),
            fileUrl,
        },
    });

    revalidatePath("/dashboard/surat");
    redirect("/dashboard/surat");
}

export async function deleteLetter(id: string) {
    await checkSuperAdmin();

    await prisma.letter.delete({ where: { id } });
    revalidatePath("/dashboard/surat");
}

export async function updateLetter(id: string, formData: FormData) {
    await checkSuperAdmin();

    const number = formData.get("number") as string;
    const subject = formData.get("subject") as string;
    const type = formData.get("type") as LetterType;
    const sender = formData.get("sender") as string;
    const receiver = formData.get("receiver") as string;
    const dateStr = formData.get("date") as string;

    const file = formData.get("file") as File;
    let fileUrl;

    if (file && file.size > 0) {
        fileUrl = await uploadFile(file, "surat");
    }

    await prisma.letter.update({
        where: { id },
        data: {
            number,
            subject,
            type,
            sender: type === "MASUK" ? sender : null,
            receiver: type === "KELUAR" ? receiver : null,
            date: new Date(dateStr),
            ...(fileUrl ? { fileUrl } : {}),
        },
    });

    revalidatePath("/dashboard/surat");
    redirect("/dashboard/surat");
}
