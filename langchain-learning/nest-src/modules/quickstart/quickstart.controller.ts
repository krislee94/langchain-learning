/**
 * 快速入门控制器
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuickstartService, QuickstartGuide } from './quickstart.service';

export class PromptDto {
  prompt: string = '';
}

@Controller('quickstart')
export class QuickstartController {
  constructor(private readonly quickstartService: QuickstartService) {}

  @Get('guide')
  getGuide(): QuickstartGuide {
    return this.quickstartService.getQuickstartGuide();
  }

  @Post('chat')
  async chat(@Body() dto: PromptDto): Promise<string> {
    return this.quickstartService.simpleChat(dto.prompt);
  }

  @Get('tool')
  createTool() {
    const tool = this.quickstartService.createSimpleTool();
    return { name: tool.name, description: tool.description };
  }
}
