import { uploadFile } from "@/lib/upload";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed." }, { status: 400 });
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
        return NextResponse.json({ error: "File size exceeds 20MB." }, { status: 400 });
    }

    try {
        const url = await uploadFile(file, "content");
        return NextResponse.json({ url });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
