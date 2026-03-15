# LangChain + LangGraph 系统化学习仓库 (TypeScript 工程化版本)

> 从入门到专家：构建生产级 AI 应用的完整指南

📚 **本仓库包含 10 个系统化章节，涵盖 LangChain 生态系统的方方面面**

---

## 🎯 工程化特性

本项目采用现代 TypeScript 工程化标准：

- ✅ **TypeScript** - 类型安全，智能提示
- ✅ **ESM Modules** - 现代模块系统
- ✅ **Zod** - 运行时类型验证
- ✅ **ESLint + Prettier** - 代码质量保障
- ✅ **Vitest** - 单元测试框架
- ✅ **pino** - 高性能结构化日志
- ✅ **Husky + lint-staged** - Git 钩子自动化
- ✅ **路径别名** - 优雅的导入路径

---

## 📖 目录结构

```
langchain-learning/
├── src/
│   ├── demos/              # 示例代码
│   │   ├── 01-first-agent.ts
│   │   ├── 02-custom-tools.ts
│   │   └── ...
│   ├── tools/              # 可复用工具
│   │   ├── index.ts
│   │   ├── weather.ts
│   │   ├── calculator.ts
│   │   └── time.ts
│   ├── utils/              # 工具函数
│   │   ├── index.ts
│   │   └── logger.ts
│   ├── chains/             # 链式调用示例
│   └── agents/             # Agent 示例
├── tests/                  # 测试文件
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── vitest.config.ts
```

---

## 🚀 快速开始

### 环境准备

```bash
# Node.js >= 20.0.0
node -v

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 填入你的 API Key
# OPENAI_API_KEY=sk-...
# 或 ANTHROPIC_API_KEY=sk-ant-...
```

### 运行示例

```bash
# 第一个 Agent
npm run demo:agent

# 自定义工具
npm run demo:tools

# 链式调用
npm run demo:chain

# 记忆系统
npm run demo:memory
```

### 开发模式

```bash
# 实时编译运行
npm run dev

# 类型检查
npm run typecheck

# 代码格式化
npm run format

# 代码检查
npm run lint
npm run lint:fix
```

### 测试

```bash
# 运行测试
npm test

# 监听模式
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## 📦 核心示例

### 创建第一个 Agent

```typescript
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

// 定义工具
const getWeather = tool(
  async ({ city }: { city: string }) => {
    return `${city} 今天晴朗，温度 25°C`;
  },
  {
    name: 'get_weather',
    description: '获取城市天气',
    schema: z.object({
      city: z.string().describe('城市名称'),
    }),
  }
);

// 创建 Agent
const model = new ChatAnthropic({ model: 'claude-sonnet-4-5' });
const agent = createReactAgent({
  model,
  tools: [getWeather],
  stateModifier: '你是一个有帮助的助手',
});

// 使用 Agent
const result = await agent.invoke({
  messages: [{ role: 'user', content: '北京天气怎么样？' }],
});
```

### 创建自定义工具

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const add = tool(
  async ({ a, b }: { a: number; b: number }) => a + b,
  {
    name: 'add',
    description: '两个数相加',
    schema: z.object({
      a: z.number().describe('第一个加数'),
      b: z.number().describe('第二个加数'),
    }),
  }
);

// 使用工具
const result = await add.invoke({ a: 3, b: 5 });
console.log(result); // 8
```

---

## 📖 学习路径

### 初级阶段（1-3 章）
- 理解 LangChain 的核心价值和行业定位
- 掌握底层架构和运行原理
- 快速上手，5 分钟搭建第一个 AI 应用

### 中级阶段（4-6 章）
- 深入六大核心组件
- 学习企业级设计模式
- 实战 5 大真实业务场景

### 高级阶段（7-10 章）
- LangGraph + Deep Agents 体系化实战
- 工程化性能调优
- 避坑指南和持续学习

---

## 🔧 工具集合

项目提供可复用的工具模块：

| 工具 | 描述 | 导入路径 |
|------|------|----------|
| `weatherTool` | 天气查询 | `@/tools/weather` |
| `calculateTool` | 数学计算 | `@/tools/calculator` |
| `getTimeTool` | 获取时间 | `@/tools/time` |
| `logger` | 结构化日志 | `@/utils/logger` |

```typescript
// 示例：导入工具
import { weatherTool, calculateTool } from '@/tools';
import { logger } from '@/utils';
```

---

## 🎨 代码规范

### 命名约定

- 文件：`kebab-case.ts` (如 `custom-tools.ts`)
- 类/组件：`PascalCase`
- 函数/变量：`camelCase`
- 常量：`UPPER_SNAKE_CASE`
- 工具函数：`*Tool` 后缀 (如 `weatherTool`)

### 类型定义

优先使用 `zod` 进行运行时类型验证：

```typescript
import { z } from 'zod';

const Schema = z.object({
  name: z.string().describe('名称'),
  age: z.number().min(0).describe('年龄'),
});
```

### 错误处理

使用结构化日志记录错误：

```typescript
import { errorWithException } from '@/utils';

try {
  // ...
} catch (error) {
  errorWithException('操作失败', error, { module: 'weather' });
  throw error;
}
```

---

## 🔗 官方资源

- [LangChain 官方文档](https://js.langchain.com/)
- [LangGraph 官方文档](https://langchain-ai.github.io/langgraphjs/)
- [LangSmith 观测平台](https://smith.langchain.com/)
- [GitHub 仓库](https://github.com/langchain-ai/langchainjs)

---

## 📝 学习建议

1. **按顺序学习**：章节设计有递进关系
2. **动手实践**：每个章节都有 demo 代码
3. **记录笔记**：在对应章节保存你的实验
4. **参考官方文档**：本仓库是对官方文档的系统化梳理
5. **编写测试**：为重要功能编写单元测试

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进本学习仓库！

### 提交代码前

```bash
# 确保代码通过检查
npm run lint
npm run format
npm run typecheck
npm test

# 提交（husky 会自动运行检查）
git commit -m "feat: 添加新功能"
```

---

**最后更新**: 2026-03-14  
**基于版本**: LangChain.js 0.3.x, LangGraph.js 0.2.x  
**Node.js**: >= 20.0.0  
**TypeScript**: 5.6.x
