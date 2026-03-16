/**
 * 工程化控制器
 */

import { Controller, Get } from '@nestjs/common';
import { EngineeringService, EngineeringPractice } from './engineering.service';

@Controller('engineering')
export class EngineeringController {
  constructor(private readonly service: EngineeringService) {}

  @Get('practices')
  getPractices(): EngineeringPractice[] {
    return this.service.getPractices();
  }

  @Get('structure')
  getProjectStructure(): string {
    return this.service.getProjectStructure();
  }
}
