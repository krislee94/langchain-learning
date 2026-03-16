/**
 * 学习路径控制器
 */

import { Controller, Get } from '@nestjs/common';
import { LearningPathService, LearningStage, Resource } from './learning-path.service';

@Controller('learning-path')
export class LearningPathController {
  constructor(private readonly service: LearningPathService) {}

  @Get()
  getLearningPath(): LearningStage[] {
    return this.service.getLearningPath();
  }

  @Get('resources')
  getResources(): Resource[] {
    return this.service.getResources();
  }
}
