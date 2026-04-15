const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.post.count();
    console.log(`Total posts: ${total}`);

    const published = await prisma.post.count({ where: { published: true } });
    console.log(`Published posts: ${published}`);

    if (total > 0 && published === 0) {
        console.log('Publishing all posts...');
        await prisma.post.updateMany({
            data: { published: true }
        });
        console.log('Done.');
    } else {
        console.log('No update needed or some are already published.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
