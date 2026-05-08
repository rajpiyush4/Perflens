import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: { name: string; url: string; userId: string }) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.projectService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Get(':id/audits')
  getAudits(@Param('id') id: string) {
    return this.projectService.getAudits(id);
  }
}
