const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const password = await hash('password123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'admin@pmii.org' },
        update: {},
        create: {
            email: 'admin@pmii.org',
            name: 'Super Admin',
            password,
            role: 'SUPER_ADMIN',
        },
    });
    console.log({ user });
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
