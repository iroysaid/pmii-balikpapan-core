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
    if (!session || !["SUPER_ADMIN", "ADMIN_CABANG"].includes(session.user?.role as string)) {
        throw new Error("Unauthorized: Insufficient permissions.");
    }
}

function generatePassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let password = "";
    for (let i = 0; i < 4; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function createKader(formData: FormData) {
    await checkSuperAdmin();

    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const komisariat = formData.get("komisariat") as string;
    const campus = formData.get("campus") as string;
    const major = formData.get("major") as string;
    const mapabaYear = formData.get("mapabaYear") as string;
    const role = (formData.get("role") as string) || "KADER";

    // New Fields
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    // Find organization
    const org = await prisma.organization.findFirst({ where: { name: komisariat } });
    const organizationId = org?.id;

    // Auto Generate No Induk (using previous logic)
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

    const generatedPassword = generatePassword();
    const hashedPassword = await hash(generatedPassword, 12);

    try {
        await prisma.user.create({
            data: {
                name,
                username,
                email: email || undefined,
                password: hashedPassword,
                role: role,
                image: imageUrl,
                organizationId,
                mustChangePassword: true,
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
                        status: "PENDING", 
                    },
                },
            },
        });

        revalidatePath("/dashboard/kader");
        return { success: true, generatedPassword, username, noInduk: newNoInduk };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
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
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;

    const komisariat = formData.get("komisariat") as string;
    const campus = formData.get("campus") as string;
    const major = formData.get("major") as string;
    const mapabaYear = formData.get("mapabaYear") as string;
    const address = formData.get("address") as string;
    const noInduk = formData.get("noInduk") as string;
    const phone = formData.get("phone") as string;
    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    const org = await prisma.organization.findFirst({ where: { name: komisariat } });
    const organizationId = org?.id;

    const imageFile = formData.get("image") as File;
    let imageUrl;

    if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadFile(imageFile, "kader");
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                username,
                email: email || undefined,
                ...(role ? { role } : {}),
                ...(imageUrl ? { image: imageUrl } : {}),
                ...(organizationId ? { organizationId } : {})
            },
        });

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
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
