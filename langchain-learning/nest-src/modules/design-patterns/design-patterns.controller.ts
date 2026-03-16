/**
 * 设计模式控制器
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { DesignPatternsService, DesignPattern } from './design-patterns.service';

export class ChainDto {
  text: string = '';
}

@Controller('design-patterns')
export class DesignPatternsController {
  constructor(private readonly service: DesignPatternsService) {}

  @Get()
  getPatterns(): DesignPattern[] {
    return this.service.getPatterns();
  }

  @Post('chain')
  async demonstrateChain(@Body() dto: ChainDto): Promise<string> {
    return this.service.demonstrateChain(dto.text);
  }
}
