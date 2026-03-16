/**
 * 快速入门模块 - 第 03 章
 */

import { Module } from '@nestjs/common';
import { QuickstartController } from './quickstart.controller';
import { QuickstartService } from './quickstart.service';

@Module({
  controllers: [QuickstartController],
  providers: [QuickstartService],
  exports: [QuickstartService],
})
export class QuickstartModule {}
