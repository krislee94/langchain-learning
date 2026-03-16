/**
 * 工程化服务
 */

import { Injectable } from '@nestjs/common';

export interface EngineeringPractice {
  category: string;
  practices: PracticeItem[];
}

export interface PracticeItem {
  name: string;
  description: string;
  tools: string[];
}

@Injectable()
export class EngineeringService {
  getPractices(): EngineeringPractice[] {
    return [
      {
        category: '代码质量',
        practices: [
          {
            name: 'TypeScript 类型安全',
            description: '使用 TypeScript 和 Zod 进行类型验证',
            tools: ['TypeScript', 'Zod', 'tsc'],
          },
          {
            name: '代码规范',
            description: 'ESLint + Prettier 统一代码风格',
            tools: ['ESLint', 'Prettier', 'Husky'],
          },
        ],
      },
      {
        category: '测试',
        practices: [
          {
            name: '单元测试',
            description: 'Jest + Testing Module',
            tools: ['Jest', '@nestjs/testing'],
          },
          {
            name: '集成测试',
            description: 'Supertest 测试 API 端点',
            tools: ['Supertest', 'Jest'],
          },
        ],
      },
      {
        category: '部署',
        practices: [
          {
            name: '容器化',
            description: 'Docker 容器部署',
            tools: ['Docker', 'docker-compose'],
          },
          {
            name: 'CI/CD',
            description: 'GitHub Actions 自动化',
            tools: ['GitHub Actions', 'npm'],
          },
        ],
      },
    ];
  }

  getProjectStructure(): string {
    return `
langchain-learning/
├── nest-src/              # NestJS 源码
│   ├── main.ts           # 入口文件
│   ├── app.module.ts     # 根模块
│   ├── modules/          # 功能模块
│   ├── services/         # 共享服务
│   └── common/           # 共享工具
├── test/                 # 测试文件
├── jest.config.ts        # Jest 配置
├── nest-cli.json         # Nest CLI 配置
└── package.json
    `.trim();
  }
}
