const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany();
    console.log('--- DB DATA CHECK ---');
    console.log(`TOTAL POSTS: ${posts.length}`);
    console.log(`PUBLISHED POSTS: ${posts.filter(p => p.published).length}`);
    if (posts.length > 0) {
        console.log(`SAMPLE TITLE: ${posts[0].title}`);
        console.log(`SAMPLE PUBLISHED: ${posts[0].published}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
