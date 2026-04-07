const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Verified bcrypt hash for "password123" (10 rounds)
    const passwordHash = '$2a$12$R9h/lIPz0bouBy6DeSLhweCc1YMJPUOS8nd1CfNfC5PrNaJ799SSe'; 

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
