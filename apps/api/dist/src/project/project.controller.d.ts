import { ProjectService } from './project.service';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    create(createProjectDto: {
        name: string;
        url: string;
        userId: string;
    }): Promise<{
        name: string;
        id: string;
        userId: string;
        url: string;
        environment: string;
        createdAt: Date;
    }>;
    findAll(userId: string): Promise<{
        name: string;
        id: string;
        userId: string;
        url: string;
        environment: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        userId: string;
        url: string;
        environment: string;
        createdAt: Date;
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
        createdAt: Date;
        projectId: string;
        status: import("@prisma/client").$Enums.AuditStatus;
        performanceScore: number | null;
        seoScore: number | null;
        accessibilityScore: number | null;
        bestPracticesScore: number | null;
    })[]>;
    update(id: string, updateProjectDto: {
        name?: string;
        url?: string;
        environment?: string;
    }): Promise<{
        name: string;
        id: string;
        userId: string;
        url: string;
        environment: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        userId: string;
        url: string;
        environment: string;
        createdAt: Date;
    }>;
}
