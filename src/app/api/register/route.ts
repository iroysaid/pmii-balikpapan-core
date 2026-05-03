import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validate Input
    if (!body.namaLengkap || !body.email || !body.noWhatsapp || !body.asalKomisariat || !body.activityId) {
       return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 400 });
    }

    // 2. Cek apakah sudah pernah mendaftar dengan email yang sama untuk activity ini
    const existingPendaftar = await prisma.pendaftar.findFirst({
        where: {
            email: body.email,
            activityId: body.activityId
        }
    });

    if (existingPendaftar) {
        return NextResponse.json({ message: "Email ini sudah terdaftar pada kegiatan tersebut." }, { status: 400 });
    }

    // 3. Simpan ke Database via Prisma
    const user = await prisma.pendaftar.create({
      data: {
        namaLengkap: body.namaLengkap,
        email: body.email,
        noWhatsapp: body.noWhatsapp,
        asalKomisariat: body.asalKomisariat,
        activityId: body.activityId,
      },
      include: {
        activity: true
      }
    });

    // 4. Kirim Webhook ke Google Apps Script untuk Otomatisasi
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "URL_DUMMY_ISI_NANTI") {
        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: user.namaLengkap,
                    email: user.email,
                    whatsapp: user.noWhatsapp,
                    asal_instansi: user.asalKomisariat,
                    kegiatan: user.activity.title,
                    timestamp: user.createdAt
                }),
            });
        } catch (fetchError) {
            console.error("Gagal mengirim webhook ke Google Script:", fetchError);
            // Tetap kembalikan sukses karena data utama sudah tersimpan di Prisma
        }
    }

    return NextResponse.json({ message: "Pendaftaran Berhasil" }, { status: 200 });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Terjadi Kesalahan Server" }, { status: 500 });
  }
}
