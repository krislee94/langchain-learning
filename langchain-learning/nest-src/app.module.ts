/**
 * 根模块 - 导入所有章节模块
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { CoreValueModule } from './modules/core-value/core-value.module';
import { ArchitectureModule } from './modules/architecture/architecture.module';
import { QuickstartModule } from './modules/quickstart/quickstart.module';
import { ComponentsModule } from './modules/components/components.module';
import { DesignPatternsModule } from './modules/design-patterns/design-patterns.module';
import { ProductionModule } from './modules/production/production.module';
import { LanggraphModule } from './modules/langgraph/langgraph.module';
import { EngineeringModule } from './modules/engineering/engineering.module';
import { TroubleshootingModule } from './modules/troubleshooting/troubleshooting.module';
import { LearningPathModule } from './modules/learning-path/learning-path.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 健康检查模块
    HealthModule,

    // 10 个章节模块
    CoreValueModule,
    ArchitectureModule,
    QuickstartModule,
    ComponentsModule,
    DesignPatternsModule,
    ProductionModule,
    LanggraphModule,
    EngineeringModule,
    TroubleshootingModule,
    LearningPathModule,
  ],
})
export class AppModule {}
