/**
 * 生产场景控制器
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductionService, ProductionScenario } from './production.service';

export class RagDto {
  query: string = '';
}

@Controller('production')
export class ProductionController {
  constructor(private readonly service: ProductionService) {}

  @Get('scenarios')
  getScenarios(): ProductionScenario[] {
    return this.service.getScenarios();
  }

  @Post('rag')
  async simulateRAG(@Body() dto: RagDto): Promise<string> {
    return this.service.simulateRAG(dto.query);
  }
}
