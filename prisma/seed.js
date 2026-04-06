const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const password = await hash('password123', 12);

    console.log('Seeding data...');

    // 1. CLEAR EXISTING DATA (Optional but cleaner for dummy)
    // await prisma.transaction.deleteMany();
    // await prisma.materialChapter.deleteMany();
    // await prisma.material.deleteMany();
    // await prisma.post.deleteMany();
    // await prisma.kaderProfile.deleteMany();
    // await prisma.user.deleteMany();

    // 2. CREATE ADMIN
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pmii.org' },
        update: {},
        create: {
            email: 'admin@pmii.org',
            name: 'Super Admin',
            password,
            role: 'SUPER_ADMIN',
        },
    });

    // 3. CREATE DUMMY KADERS
    const kaders = [
        { name: 'Ahmad Fauzi', email: 'ahmad@example.com', rayon: 'Rayon Teknik', komisariat: 'Kampus Merdeka' },
        { name: 'Siti Aminah', email: 'siti@example.com', rayon: 'Rayon Ekonomi', komisariat: 'Kampus Sejahtera' },
        { name: 'Budi Santoso', email: 'budi@example.com', rayon: 'Rayon Hukum', komisariat: 'Kampus Merdeka' },
    ];

    for (const k of kaders) {
        await prisma.user.upsert({
            where: { email: k.email },
            update: {},
            create: {
                email: k.email,
                name: k.name,
                password,
                role: 'KADER',
                kaderProfile: {
                    create: {
                        rayon: k.rayon,
                        komisariat: k.komisariat,
                        status: 'VERIFIED',
                        campus: 'Universitas Balikpapan',
                        major: 'Informatika',
                    }
                }
            }
        });
    }

    // 4. CREATE DUMMY POSTS (BERITA)
    const posts = [
        {
            title: 'Malam Refleksi PMII Balikpapan Menjelang Bulan Ramadhan',
            slug: 'malam-refleksi-pmii-balikpapan',
            content: 'Pengurus Cabang PMII Balikpapan menggelar acara malam refleksi yang dihadiri oleh seluruh kader se-kota Balikpapan...',
            image: 'https://images.unsplash.com/photo-1541844053587-346746bb15bb?q=80&w=600',
            published: true,
            author: 'Admin PC'
        },
        {
            title: 'Pelatihan Kader Dasar (PKD) Ke-XV Telah Dibuka',
            slug: 'pkd-pmii-balikpapan-2024',
            content: 'Segera daftarkan diri anda untuk mengikuti Pelatihan Kader Dasar (PKD) yang akan dilaksanakan pada bulan depan...',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
            published: true,
            author: 'Sekretariat'
        }
    ];

    for (const p of posts) {
        await prisma.post.upsert({
            where: { slug: p.slug },
            update: {},
            create: p
        });
    }

    // 5. CREATE DUMMY E-LEARNING (MATERIALS)
    const material1 = await prisma.material.create({
        data: {
            title: 'Modul MAPABA Dasar',
            description: 'Materi dasar pengetahuan keorganisasian PMII untuk calon anggota baru.',
            chapters: {
                create: [
                    { title: 'Sejarah Pergerakan', type: 'DOCUMENT', sortOrder: 1 },
                    { title: 'Nilai Dasar Pergerakan (NDP)', type: 'DOCUMENT', sortOrder: 2 },
                    { title: 'Video Profil Organisasi', type: 'YOUTUBE', youtubeUrl: 'https://youtube.com/watch?v=123', sortOrder: 3 }
                ]
            }
        }
    });

    // 6. CREATE TRANSACTIONS (KEUANGAN)
    const transactions = [
        { description: 'Iuran Wajib Kader Januari 2024', type: 'DEBIT', amount: 500000, balance: 500000 },
        { description: 'Pembelian Alat Tulis Sekretariat', type: 'CREDIT', amount: 150000, balance: 350000 },
        { description: 'Donasi Alumni Angkatan 2010', type: 'DEBIT', amount: 1000000, balance: 1350000 }
    ];

    for (const t of transactions) {
        await prisma.transaction.create({
            data: t
        });
    }

    // 7. CREATE DUMMY ACTIVITIES (KEGIATAN)
    const activities = [
        {
            title: 'MAPABA Raya 2024',
            slug: 'mapaba-raya-2024',
            description: 'Masa Penerimaan Anggota Baru untuk seluruh mahasiswa islam se-Balikpapan.',
            eventDate: new Date('2024-05-20'),
            image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=1200',
        },
        {
            title: 'Kajian Pergerakan: Sejarah NU',
            slug: 'kajian-pergerakan-sejarah-nu',
            description: 'Kajian rutin mingguan membahas sejarah dan peranan NU dalam kemerdekaan.',
            eventDate: new Date('2024-04-15'),
            image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200',
        },
        {
            title: 'Bakti Sosial Panti Asuhan',
            slug: 'bakti-sosial-panti-asuhan',
            description: 'Kegiatan berbagi kebahagiaan dengan adik-adik di panti asuhan.',
            eventDate: new Date('2024-02-10'),
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200',
        }
    ];

    for (const a of activities) {
        await prisma.activity.upsert({
            where: { slug: a.slug },
            update: {},
            create: {
                ...a,
                photos: {
                   create: [
                      { url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=400' },
                      { url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400' }
                   ]
                }
            }
        });
    }

    console.log('Seeding finished!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
