/**
 * 组件控制器
 */

import { Controller, Get } from '@nestjs/common';
import { ComponentsService, ComponentInfo } from './components.service';

export class ChainDto {
  text: string = '';
}

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get()
  getComponents(): ComponentInfo[] {
    return this.componentsService.getComponents();
  }

  @Get('prompt')
  async demonstratePrompt(): Promise<string> {
    return this.componentsService.demonstratePrompt();
  }

  @Post('chain')
  async demonstrateChain(@Body() dto: ChainDto): Promise<string> {
    return this.componentsService.demonstrateChain(dto.text);
  }

  @Get('tool')
  createTool() {
    const tool = this.componentsService.createDemoTool();
    return { name: tool.name, description: tool.description };
  }
}
