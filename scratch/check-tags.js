const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Check tags table
    const tagCount = await prisma.tag.count().catch(() => 'TAG TABLE MISSING');
    console.log('TAG COUNT:', tagCount);
    
    const posts = await prisma.post.count();
    console.log('POST COUNT:', posts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
