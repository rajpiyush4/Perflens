import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; url: string; userId: string }): Promise<Project> {
    return this.prisma.project.create({
      data: {
        name: data.name,
        url: data.url,
        userId: data.userId,
      },
    });
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
}
