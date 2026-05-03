const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateTempPassword(length = 4) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
}

async function main() {
    console.log('--- Starting Bulk Password Reset ---');
    
    // Fetch users with target roles
    const targetRoles = ['KADER', 'PENGURUS_KOMISARIAT', 'PENGURUS_CABANG'];
    const users = await prisma.user.findMany({
        where: {
            role: { in: targetRoles }
        },
        include: {
            kaderProfile: true
        }
    });

    console.log(`Found ${users.length} accounts to reset.`);

    const exportData = [];
    const today = new Date().toISOString().split('T')[0];
    const csvFilename = `reset-password-kader-${today}.csv`;
    const csvPath = path.join(__dirname, 'public', 'uploads', csvFilename);

    // CSV Header
    exportData.push('nama_lengkap,username,nia,komisariat,role,password_sementara');

    let successCount = 0;

    for (const user of users) {
        const tempPassword = generateTempPassword(4);
        const hashedPassword = await bcrypt.hash(tempPassword, 12);

        try {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    mustChangePassword: true
                }
            });

            const row = [
                `"${user.name}"`,
                `"${user.username}"`,
                `"${user.kaderProfile?.noInduk || '-'}"`,
                `"${user.kaderProfile?.komisariat || '-'}"`,
                `"${user.role}"`,
                `"${tempPassword}"`
            ].join(',');

            exportData.push(row);
            successCount++;
            
            if (successCount % 10 === 0) {
                console.log(`Processed ${successCount}/${users.length}...`);
            }
        } catch (error) {
            console.error(`Failed to reset user ${user.username}:`, error);
        }
    }

    // Write to CSV
    fs.writeFileSync(csvPath, exportData.join('\n'));

    console.log('--- Reset Complete ---');
    console.log(`Total successfully reset: ${successCount}`);
    console.log(`Exported to: /public/uploads/${csvFilename}`);
    
    // Show some examples for verification
    console.log('\n--- Sample Output ---');
    console.log(exportData.slice(0, 4).join('\n'));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
