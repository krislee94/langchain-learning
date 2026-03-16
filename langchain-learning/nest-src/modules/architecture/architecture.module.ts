/**
 * 架构模块 - 第 02 章
 * 演示消息传递流程和自定义工具
 */

import { Module } from '@nestjs/common';
import { ArchitectureController } from './architecture.controller';
import { ArchitectureService } from './architecture.service';

@Module({
  controllers: [ArchitectureController],
  providers: [ArchitectureService],
  exports: [ArchitectureService],
})
export class ArchitectureModule {}
