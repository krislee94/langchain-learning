/**
 * LangGraph 控制器
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { LanggraphService, GraphDefinition } from './langgraph.service';

export class GraphExecuteDto {
  input: string = '';
}

@Controller('langgraph')
export class LanggraphController {
  constructor(private readonly service: LanggraphService) {}

  @Get('basic')
  getBasicGraph(): GraphDefinition {
    return this.service.getBasicGraph();
  }

  @Get('deep-agents')
  getDeepAgentsGraph(): GraphDefinition {
    return this.service.getDeepAgentsGraph();
  }

  @Post('execute')
  async execute(@Body() dto: GraphExecuteDto): Promise<string> {
    return this.service.simulateGraphExecution(dto.input);
  }
}
