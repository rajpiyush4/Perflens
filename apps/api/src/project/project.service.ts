import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) { }

  async create(data: { name: string; url: string; userId: string }): Promise<Project> {
    try {
      console.log('[ProjectService] Creating project with data:', data);
      return await this.prisma.project.create({
        data: {
          name: data.name,
          url: data.url,
          userId: data.userId,
        },
      });
    } catch (error) {
      console.error('[ProjectService] CREATE ERROR:', error);
      throw error;
    }
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId },
      include: {
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async getAudits(projectId: string) {
    return this.prisma.audit.findMany({
      where: { projectId },
      include: {
        webVitals: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: { name?: string; url?: string; environment?: string }): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Project> {
    return this.prisma.$transaction(async (tx) => {
      // Find all audit IDs for this project
      const audits = await tx.audit.findMany({
        where: { projectId: id },
        select: { id: true },
      });
      const auditIds = audits.map((a) => a.id);

      if (auditIds.length > 0) {
        await tx.webVitals.deleteMany({ where: { auditId: { in: auditIds } } });
        await tx.bundleAnalysis.deleteMany({ where: { auditId: { in: auditIds } } });
        await tx.audit.deleteMany({ where: { projectId: id } });
      }

      await tx.alert.deleteMany({ where: { projectId: id } });

      return tx.project.delete({
        where: { id },
      });
    });
  }
}
