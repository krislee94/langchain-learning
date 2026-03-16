/**
 * 故障排查模块 - 第 09 章
 */

import { Module } from '@nestjs/common';
import { TroubleshootingController } from './troubleshooting.controller';
import { TroubleshootingService } from './troubleshooting.service';

@Module({
  controllers: [TroubleshootingController],
  providers: [TroubleshootingService],
  exports: [TroubleshootingService],
})
export class TroubleshootingModule {}
