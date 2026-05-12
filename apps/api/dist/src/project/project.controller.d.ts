import { ProjectService } from './project.service';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: {
        name: string;
        url: string;
        userId: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        url: string;
        environment: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        url: string;
        environment: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        userId: string;
        url: string;
        environment: string;
    } | null>;
    getAudits(id: string): Promise<({
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
        projectId: string;
        status: import("@prisma/client").$Enums.AuditStatus;
        performanceScore: number | null;
        seoScore: number | null;
        accessibilityScore: number | null;
        bestPracticesScore: number | null;
        createdAt: Date;
    })[]>;
}
