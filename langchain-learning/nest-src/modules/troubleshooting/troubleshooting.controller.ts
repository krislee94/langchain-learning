/**
 * 故障排查控制器
 */

import { Controller, Get } from '@nestjs/common';
import { TroubleshootingService, CommonIssue, DebugTip } from './troubleshooting.service';

@Controller('troubleshooting')
export class TroubleshootingController {
  constructor(private readonly service: TroubleshootingService) {}

  @Get('issues')
  getCommonIssues(): CommonIssue[] {
    return this.service.getCommonIssues();
  }

  @Get('tips')
  getDebugTips(): DebugTip[] {
    return this.service.getDebugTips();
  }
}
