"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const pool = new pg_1.Pool({ connectionString: "postgresql://perflens_user:perflens_password@localhost:5432/perflens_db?schema=public" });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function seed() {
    const user = await prisma.user.upsert({
        where: { email: 'test@perflens.com' },
        update: {},
        create: {
            email: 'test@perflens.com',
            name: 'Test User',
        },
    });
    const project = await prisma.project.create({
        data: {
            name: 'Acme.com',
            url: 'https://example.com',
            userId: user.id,
        },
    });
    console.log('Seed completed!');
    console.log('Project ID:', project.id);
}
seed().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map