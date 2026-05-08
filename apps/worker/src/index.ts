import { Worker, Job } from 'bullmq';
import lighthouse from 'lighthouse';
import * as puppeteer from 'puppeteer';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as os from 'os';

const pool = new Pool({ connectionString: "postgresql://perflens_user:perflens_password@localhost:5432/perflens_db?schema=public" });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

// Connection to Redis
const connection = {
  host: 'localhost',
  port: 6379,
};

function checkSystemHealth() {
  const freeMem = os.freemem() / (1024 * 1024); // MB
  const loadAvg = os.loadavg()[0]; // 1 min load average
  const cpuCount = os.cpus().length;

  console.log(`[Health Check] Free RAM: ${freeMem.toFixed(0)}MB, CPU Load: ${loadAvg.toFixed(2)}`);

  if (freeMem < 512) {
    console.warn('⚠️ LOW MEMORY: Audit accuracy may be affected.');
  }
  if (loadAvg > cpuCount * 0.8) {
    console.warn('⚠️ HIGH CPU LOAD: Audit results might be noisy due to resource contention.');
  }
}

async function runAudit(url: string) {
  // Check health before starting
  checkSystemHealth();
  
  console.log(`[Lighthouse] Starting audit for: ${url}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const { lhr } = await (lighthouse as any)(url, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
    };

    const webVitals = {
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      tti: lhr.audits.interactive.numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
    };

    return { scores, webVitals };
  } finally {
    await browser.close();
  }
}

// Create the Worker
const worker = new Worker(
  'audit-queue',
  async (job: Job) => {
    const { auditId, url } = job.data;
    console.log(`[Worker] Processing audit ${auditId} for ${url}`);

    try {
      // 1. Update status to RUNNING
      await prisma.audit.update({
        where: { id: auditId },
        data: { status: 'RUNNING' },
      });

      // 2. Run the audit
      const results = await runAudit(url);

      // 3. Save results and mark as COMPLETED
      await prisma.audit.update({
        where: { id: auditId },
        data: {
          status: 'COMPLETED',
          performanceScore: results.scores.performance,
          accessibilityScore: results.scores.accessibility,
          bestPracticesScore: results.scores.bestPractices,
          seoScore: results.scores.seo,
          webVitals: {
            create: {
              lcp: results.webVitals.lcp,
              fcp: results.webVitals.fcp,
              cls: results.webVitals.cls,
              tti: results.webVitals.tti,
              tbt: results.webVitals.tbt,
            }
          }
        },
      });

      console.log(`[Worker] Audit ${auditId} completed successfully`);
    } catch (error) {
      console.error(`[Worker] Audit ${auditId} failed:`, error);

      await prisma.audit.update({
        where: { id: auditId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  },
  {
    connection,
    concurrency: 2 // As requested: Only 2 audits at a time
  }
);

worker.on('ready', () => {
  console.log('🚀 Audit Worker is ready and listening for jobs...');
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with ${err.message}`);
});
