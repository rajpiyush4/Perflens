"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
let AuditService = AuditService_1 = class AuditService {
    auditQueue;
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(auditQueue, prisma) {
        this.auditQueue = auditQueue;
        this.prisma = prisma;
    }
    async scheduleAudit(projectId) {
        this.logger.log(`Scheduling audit for project: ${projectId}`);
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });
        if (!project) {
            this.logger.error(`Failed to schedule audit: Project ${projectId} not found`);
            throw new Error('Project not found');
        }
        const audit = await this.prisma.audit.create({
            data: {
                projectId: project.id,
                status: 'PENDING',
            },
        });
        this.logger.log(`Created PENDING audit record: ${audit.id}`);
        await this.auditQueue.add('run-lighthouse', {
            auditId: audit.id,
            url: project.url,
        });
        this.logger.log(`Job successfully dispatched to audit-queue for URL: ${project.url}`);
        return audit;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('audit-queue')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map