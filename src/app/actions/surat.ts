"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type LetterType = "MASUK" | "KELUAR";

async function getAuthorizedSession() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const role = session.user.role as string;
    if (role === "KADER" || role === "PUBLIC") {
        throw new Error("Unauthorized: Insufficient permissions.");
    }
    return session;
}

export async function createLetter(formData: FormData) {
    const session = await getAuthorizedSession();
    const organizationId = session.user.organizationId as string | null;

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
            organizationId
        },
    });

    revalidatePath("/dashboard/surat");
    redirect("/dashboard/surat");
}

export async function deleteLetter(id: string) {
    const session = await getAuthorizedSession();

    // Authorization check
    const letter = await prisma.letter.findUnique({ where: { id } });
    if (!letter) throw new Error("Not found");
    if (session.user.role === "PENGURUS_KOMISARIAT" && letter.organizationId !== session.user.organizationId) {
        throw new Error("Unauthorized");
    }

    await prisma.letter.delete({ where: { id } });
    revalidatePath("/dashboard/surat");
}

export async function updateLetter(id: string, formData: FormData) {
    const session = await getAuthorizedSession();

    // Authorization check
    const letter = await prisma.letter.findUnique({ where: { id } });
    if (!letter) throw new Error("Not found");
    if (session.user.role === "PENGURUS_KOMISARIAT" && letter.organizationId !== session.user.organizationId) {
        throw new Error("Unauthorized");
    }

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
