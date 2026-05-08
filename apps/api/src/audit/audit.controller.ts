import { Controller, Post, Param } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post(':projectId')
  async runAudit(@Param('projectId') projectId: string) {
    return this.auditService.scheduleAudit(projectId);
  }
}
