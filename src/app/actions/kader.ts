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

function getKomisariatCode(komisariat: string) {
    const codes: Record<string, string> = {
        "Komisariat Nusantara": "1",
        "Komisariat Uniba": "2",
        "Komisariat Mulia": "3",
        "Komisariat Staiba": "4",
        "Komisariat Stitba": "5"
    };
    return codes[komisariat] || "0";
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

    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const placeOfBirth = formData.get("placeOfBirth") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const campusAddress = formData.get("campusAddress") as string;
    const faculty = formData.get("faculty") as string;
    const pkdYear = formData.get("pkdYear") as string;
    const pkdLocation = formData.get("pkdLocation") as string;
    const pkdOrganizer = formData.get("pkdOrganizer") as string;
    const pklYear = formData.get("pklYear") as string;
    const pklLocation = formData.get("pklLocation") as string;
    const pklOrganizer = formData.get("pklOrganizer") as string;
    const pknYear = formData.get("pknYear") as string;
    const pknLocation = formData.get("pknLocation") as string;
    const pknOrganizer = formData.get("pknOrganizer") as string;
    const otherTraining = formData.get("otherTraining") as string;

    // Find organization
    const org = await prisma.organization.findFirst({ where: { name: komisariat } });
    const organizationId = org?.id;

    // Auto Generate NIA (1110 + KODE_KOMISARIAT + YY + NOMOR_URUT)
    const currentYear = mapabaYear ? mapabaYear.slice(-2) : new Date().getFullYear().toString().slice(-2);
    const kodeKomisariat = getKomisariatCode(komisariat);
    const prefix = `1110${kodeKomisariat}${currentYear}`;

    const allKaders = await prisma.kaderProfile.findMany({
        where: { noInduk: { not: null } },
        select: { noInduk: true }
    });
    
    let maxSequence = 0;
    for (const k of allKaders) {
        if (k.noInduk && k.noInduk.length === 11) {
            const seq = parseInt(k.noInduk.slice(-4), 10);
            if (!isNaN(seq) && seq > maxSequence) {
                maxSequence = seq;
            }
        }
    }
    const newNoInduk = `${prefix}${(maxSequence + 1).toString().padStart(4, "0")}`;

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
                        campusAddress,
                        faculty,
                        major,
                        mapabaYear,
                        pkdYear,
                        pkdLocation,
                        pkdOrganizer,
                        pklYear,
                        pklLocation,
                        pklOrganizer,
                        pknYear,
                        pknLocation,
                        pknOrganizer,
                        otherTraining,
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
    const campusAddress = formData.get("campusAddress") as string;
    const faculty = formData.get("faculty") as string;
    const pkdYear = formData.get("pkdYear") as string;
    const pkdLocation = formData.get("pkdLocation") as string;
    const pkdOrganizer = formData.get("pkdOrganizer") as string;
    const pklYear = formData.get("pklYear") as string;
    const pklLocation = formData.get("pklLocation") as string;
    const pklOrganizer = formData.get("pklOrganizer") as string;
    const pknYear = formData.get("pknYear") as string;
    const pknLocation = formData.get("pknLocation") as string;
    const pknOrganizer = formData.get("pknOrganizer") as string;
    const otherTraining = formData.get("otherTraining") as string;

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
                campusAddress,
                faculty,
                major,
                mapabaYear,
                address,
                noInduk,
                phone,
                birthPlace: placeOfBirth,
                birthDate: dateOfBirth ? new Date(dateOfBirth) : null,
                pkdYear,
                pkdLocation,
                pkdOrganizer,
                pklYear,
                pklLocation,
                pklOrganizer,
                pknYear,
                pknLocation,
                pknOrganizer,
                otherTraining,
            },
            create: {
                userId,
                komisariat,
                campus,
                campusAddress,
                faculty,
                major,
                mapabaYear,
                address,
                noInduk,
                phone,
                birthPlace: placeOfBirth,
                birthDate: dateOfBirth ? new Date(dateOfBirth) : null,
                pkdYear,
                pkdLocation,
                pkdOrganizer,
                pklYear,
                pklLocation,
                pklOrganizer,
                pknYear,
                pknLocation,
                pknOrganizer,
                otherTraining,
                status: "VERIFIED"
            }
        });

        revalidatePath("/dashboard/kader");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
