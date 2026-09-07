import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
export declare class ProjectService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        url: string;
        userId: string;
    }): Promise<Project>;
    findAll(userId: string): Promise<Project[]>;
    findOne(id: string): Promise<Project | null>;
    getAudits(projectId: string): Promise<({
        webVitals: {
            id: string;
            auditId: string;
            lcp: number | null;
            cls: number | null;
            inp: number | null;
            tti: number | null;
            fcp: number | null;
            tbt: number | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.AuditStatus;
        performanceScore: number | null;
        seoScore: number | null;
        accessibilityScore: number | null;
        bestPracticesScore: number | null;
    })[]>;
}
