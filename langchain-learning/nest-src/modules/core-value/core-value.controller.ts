/**
 * 核心价值控制器
 */

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  CoreValueService,
  ModelProvider,
  ModelResponse,
  CompareResult,
} from './core-value.service';

export class PromptDto {
  prompt: string = '';
}

@Controller('core-value')
export class CoreValueController {
  constructor(private readonly coreValueService: CoreValueService) {}

  @Get('providers')
  getProviders(): ModelProvider[] {
    return this.coreValueService.getProviders();
  }

  @Get('compare')
  compareProviders(): CompareResult {
    return this.coreValueService.compareProviders();
  }

  @Post('anthropic')
  async useAnthropic(@Body() dto: PromptDto): Promise<ModelResponse> {
    return this.coreValueService.useAnthropic(dto.prompt);
  }

  @Post('openai')
  async useOpenAI(@Body() dto: PromptDto): Promise<ModelResponse> {
    return this.coreValueService.useOpenAI(dto.prompt);
  }
}
