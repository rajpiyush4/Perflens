import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: "postgresql://perflens_user:perflens_password@localhost:5432/perflens_db?schema=public" });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

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
