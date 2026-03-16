/**
 * NestJS + LangChain 学习平台 - 应用入口
 *
 * 运行方式:
 *   npm run start:nest
 *   或 npx nest start
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 启用 CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 设置全局前缀
  app.setGlobalPrefix('api');

  const port = process.env.NEST_PORT || 3001;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   LangChain 学习平台 - NestJS 版已启动                      ║
╠═══════════════════════════════════════════════════════════╣
║   访问地址：http://localhost:${port}                        ║
║   API 前缀：/api                                           ║
║                                                           ║
║   可用端点：                                               ║
║   - GET  /api/health          健康检查                     ║
║   - GET  /api/core-value      核心价值演示                 ║
║   - GET  /api/architecture    架构演示                     ║
║   - GET  /api/quickstart      快速入门                     ║
║   - GET  /api/components      组件演示                     ║
║   - GET  /api/design-patterns 设计模式                     ║
║   - GET  /api/production      生产场景                     ║
║   - GET  /api/langgraph       LangGraph 演示               ║
║   - GET  /api/engineering     工程化                       ║
║   - GET  /api/troubleshooting 故障排查                     ║
║   - GET  /api/learning-path   学习路径                     ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  console.error('应用启动失败:', error);
  process.exit(1);
});
