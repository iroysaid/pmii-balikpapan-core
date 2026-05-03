"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type TransactionType = "DEBIT" | "CREDIT";

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

export async function createTransaction(formData: FormData) {
    const session = await getAuthorizedSession();
    const organizationId = session.user.organizationId as string | null;

    const dateStr = formData.get("date") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as TransactionType; 
    const amount = parseFloat(formData.get("amount") as string);

    const lastTransaction = await prisma.transaction.findFirst({
        where: organizationId ? { organizationId } : {},
        orderBy: { createdAt: "desc" },
    });

    const previousBalance = lastTransaction ? lastTransaction.balance : 0;
    let newBalance = previousBalance;

    if (type === "DEBIT") {
        newBalance += amount;
    } else {
        newBalance -= amount;
    }

    await prisma.transaction.create({
        data: {
            date: new Date(dateStr),
            description,
            type,
            amount,
            balance: newBalance,
            organizationId,
        },
    });

    revalidatePath("/dashboard/keuangan");
    redirect("/dashboard/keuangan");
}

export async function deleteTransaction(id: string) {
    const session = await getAuthorizedSession();
    
    // Authorization check
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new Error("Not found");
    if (session.user.role === "PENGURUS_KOMISARIAT" && transaction.organizationId !== session.user.organizationId) {
        throw new Error("Unauthorized");
    }

    await prisma.transaction.delete({ where: { id } });
    revalidatePath("/dashboard/keuangan");
}

export async function updateTransaction(id: string, formData: FormData) {
    const session = await getAuthorizedSession();

    // Authorization check
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new Error("Not found");
    if (session.user.role === "PENGURUS_KOMISARIAT" && transaction.organizationId !== session.user.organizationId) {
        throw new Error("Unauthorized");
    }

    const dateStr = formData.get("date") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as TransactionType;
    const amount = parseFloat(formData.get("amount") as string);

    await prisma.transaction.update({
        where: { id },
        data: {
            date: new Date(dateStr),
            description,
            type,
            amount,
        }
    });

    revalidatePath("/dashboard/keuangan");
    redirect("/dashboard/keuangan");
}
