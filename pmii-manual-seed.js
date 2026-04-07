const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Correct bcrypt hash for "password123"
    const passwordHash = '$2b$12$12nN1eaECzSS.OkDiNDJm.3RJTauvqIC7dhkhCnbS0NaRYYcL4cTO'; 

    console.log('Seeding Super Admin directly into /app/dev.db...');
    
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pmii.org' },
        update: {
            password: passwordHash,
        },
        create: {
            email: 'admin@pmii.org',
            name: 'Super Admin',
            password: passwordHash,
            role: 'SUPER_ADMIN',
        },
    });

    console.log('Admin created/verified:', admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
