"use server";

import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/upload";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerKader(formData: FormData) {
    // No Admin Check here - Public Registration

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const komisariat = formData.get("komisariat") as string;
    const campus = formData.get("campus") as string;
    const major = formData.get("major") as string;
    const mapabaYear = formData.get("mapabaYear") as string;

    // ...

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

    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "KADER", // Force KADER role
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
                    status: "PENDING", // PENDING verification
                },
            },
        },
    });

    // Redirect to status page with the new user's ID
    redirect(`/daftar/status/${newUser.id}`);
}
