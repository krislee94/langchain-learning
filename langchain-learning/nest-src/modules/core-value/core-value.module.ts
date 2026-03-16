/**
 * 核心价值模块 - 第 01 章
 * 演示 LangChain 统一模型接口的价值
 */

import { Module } from '@nestjs/common';
import { CoreValueController } from './core-value.controller';
import { CoreValueService } from './core-value.service';

@Module({
  controllers: [CoreValueController],
  providers: [CoreValueService],
  exports: [CoreValueService],
})
export class CoreValueModule {}
