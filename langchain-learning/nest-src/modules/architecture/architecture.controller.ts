/**
 * 架构控制器
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ArchitectureService,
  MessageFlow,
  ToolDefinition,
} from './architecture.service';

export class PromptTemplateDto {
  role: string = '';
  style: string = '';
  question: string = '';
}

export class ExecuteToolDto {
  toolName: string = '';
  params: Record<string, unknown> = {};
}

@Controller('architecture')
export class ArchitectureController {
  constructor(private readonly architectureService: ArchitectureService) {}

  @Get('message-flow')
  getMessageFlow(): MessageFlow {
    return this.architectureService.getMessageTypes();
  }

  @Post('prompt-template')
  async createPromptTemplate(
    @Body() dto: PromptTemplateDto,
  ): Promise<string[]> {
    return this.architectureService.createPromptTemplate(
      dto.role,
      dto.style,
      dto.question,
    );
  }

  @Get('tools')
  getTools(): ToolDefinition[] {
    return this.architectureService.createCalculatorTools();
  }

  @Post('execute-tool')
  async executeTool(@Body() dto: ExecuteToolDto): Promise<unknown> {
    return this.architectureService.executeTool(dto.toolName, dto.params);
  }
}
