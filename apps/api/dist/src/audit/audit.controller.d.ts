import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    runAudit(projectId: string): Promise<{
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
