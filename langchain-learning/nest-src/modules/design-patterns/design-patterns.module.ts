/**
 * 设计模式模块 - 第 05 章
 */

import { Module } from '@nestjs/common';
import { DesignPatternsController } from './design-patterns.controller';
import { DesignPatternsService } from './design-patterns.service';

@Module({
  controllers: [DesignPatternsController],
  providers: [DesignPatternsService],
  exports: [DesignPatternsService],
})
export class DesignPatternsModule {}
