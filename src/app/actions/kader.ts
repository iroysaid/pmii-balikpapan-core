"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function checkSuperAdmin() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SUPER_ADMIN") {
        throw new Error("Unauthorized: Only Super Admin can perform this action.");
    }
}

export async function createKader(formData: FormData) {
    await checkSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const komisariat = formData.get("komisariat") as string;
    const campus = formData.get("campus") as string;
    const major = formData.get("major") as string;
    const mapabaYear = formData.get("mapabaYear") as string;
    const role = (formData.get("role") as string) || "KADER"; // Allow role assignment

    // New Fields
    const address = formData.get("address") as string;
    // const noInduk = formData.get("noInduk") as string; // Auto Generated
    const phone = formData.get("phone") as string;
    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string; // String from date input

    // Auto Generate No Induk
    const lastKader = await prisma.kaderProfile.findFirst({
        where: { noInduk: { not: null } },
        orderBy: { noInduk: "desc" },
    });

    let newNoInduk = "001";
    if (lastKader && lastKader.noInduk) {
        const currentId = parseInt(lastKader.noInduk);
        if (!isNaN(currentId)) {
            newNoInduk = (currentId + 1).toString().padStart(3, "0");
        } else {
            newNoInduk = (parseInt(lastKader.noInduk.replace(/\D/g, '')) + 1).toString().padStart(3, "0");
            if (newNoInduk === "NaN") newNoInduk = "001";
        }
    }

    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "kader");
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role,
            image: imageUrl,
            kaderProfile: {
                create: {
                    komisariat,
                    campus,
                    major,
                    mapabaYear,
                    address,
                    noInduk: newNoInduk,
                    phone,
                    birthPlace: placeOfBirth,
                    birthDate: dateOfBirth ? new Date(dateOfBirth) : null,
                    status: "PENDING", // Default to Pending for manual verification
                },
            },
        },
    });

    revalidatePath("/dashboard/kader");
    redirect("/dashboard/kader");
}

export async function verifyKader(userId: string) {
    await checkSuperAdmin();

    await prisma.kaderProfile.update({
        where: { userId },
        data: { status: "VERIFIED" },
    });
    revalidatePath("/dashboard/kader");
}

export async function deleteKader(userId: string) {
    await checkSuperAdmin();

    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/dashboard/kader");
}

export async function updateKader(userId: string, formData: FormData) {
    await checkSuperAdmin();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string; // Allow role update

    // Check if we are updating profile specific fields
    const komisariat = formData.get("komisariat") as string;
    const campus = formData.get("campus") as string;
    const major = formData.get("major") as string;
    const mapabaYear = formData.get("mapabaYear") as string;
    const address = formData.get("address") as string;
    const noInduk = formData.get("noInduk") as string;
    const phone = formData.get("phone") as string;
    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    const imageFile = formData.get("image") as File;
    let imageUrl;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "kader");
    }

    // Update User
    await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            ...(role ? { role } : {}), // Update role if provided
            ...(imageUrl ? { image: imageUrl } : {}),
        },
    });

    // Upsert Profile
    await prisma.kaderProfile.upsert({
        where: { userId },
        update: {
            komisariat,
            campus,
            major,
            mapabaYear,
            address,
            noInduk,
            phone,
            birthPlace: placeOfBirth,
            birthDate: dateOfBirth ? new Date(dateOfBirth) : null,
        },
        create: {
            userId,
            komisariat,
            campus,
            major,
            mapabaYear,
            address,
            noInduk,
            phone,
            birthPlace: placeOfBirth,
            birthDate: dateOfBirth ? new Date(dateOfBirth) : null,
            status: "VERIFIED"
        }
    });

    revalidatePath("/dashboard/kader");
    redirect("/dashboard/kader");
}
