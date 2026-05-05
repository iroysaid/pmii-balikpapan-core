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

async function recalculateBalances(organizationId: string | null) {
    const transactions = await prisma.transaction.findMany({
        where: organizationId ? { organizationId } : { organizationId: null },
        orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });

    let balance = 0;
    for (const transaction of transactions) {
        balance += transaction.type === "DEBIT" ? transaction.amount : -transaction.amount;
        await prisma.transaction.update({
            where: { id: transaction.id },
            data: { balance },
        });
    }
}

export async function createTransaction(formData: FormData) {
    const session = await getAuthorizedSession();
    const organizationId = session.user.organizationId as string | null;

    const dateStr = formData.get("date") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as TransactionType; 
    const amount = parseFloat(formData.get("amount") as string);

    await prisma.transaction.create({
        data: {
            date: new Date(dateStr),
            description,
            type,
            amount,
            balance: 0,
            organizationId,
        },
    });
    await recalculateBalances(organizationId);

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
    await recalculateBalances(transaction.organizationId);
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
    await recalculateBalances(transaction.organizationId);

    revalidatePath("/dashboard/keuangan");
    redirect("/dashboard/keuangan");
}
