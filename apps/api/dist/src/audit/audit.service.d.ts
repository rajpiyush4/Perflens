import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private auditQueue;
    private prisma;
    private readonly logger;
    constructor(auditQueue: Queue, prisma: PrismaService);
    scheduleAudit(projectId: string): Promise<{
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.AuditStatus;
        performanceScore: number | null;
        seoScore: number | null;
        accessibilityScore: number | null;
        bestPracticesScore: number | null;
    }>;
}
