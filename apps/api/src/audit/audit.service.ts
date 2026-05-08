import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectQueue('audit-queue') private auditQueue: Queue,
    private prisma: PrismaService,
  ) { }

  async scheduleAudit(projectId: string) {
    this.logger.log(`Scheduling audit for project: ${projectId}`);

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      this.logger.error(`Failed to schedule audit: Project ${projectId} not found`);
      throw new Error('Project not found');
    }

    // 1. Create a PENDING audit record
    const audit = await this.prisma.audit.create({
      data: {
        projectId: project.id,
        status: 'PENDING',
      },
    });

    this.logger.log(`Created PENDING audit record: ${audit.id}`);

    // 2. Add to the queue for the worker to process
    await this.auditQueue.add('run-lighthouse', {
      auditId: audit.id,
      url: project.url,
    });

    this.logger.log(`Job successfully dispatched to audit-queue for URL: ${project.url}`);

    return audit;
  }
}
