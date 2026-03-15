# Python → TypeScript 迁移指南

本文档说明从 Python 版本迁移到 TypeScript 工程化版本的主要变化。

---

## 📋 主要变化

### 1. 项目结构

**Python 版本:**
```
langchain-learning/
├── 01-core-value/demos/01-first-agent.py
├── 02-architecture/demos/02-custom-tool.py
└── ...
```

**TypeScript 版本:**
```
langchain-learning/
├── src/
│   ├── demos/
│   ├── tools/
│   ├── utils/
│   ├── chains/
│   └── agents/
├── tests/
├── package.json
├── tsconfig.json
└── ...
```

### 2. 依赖管理

**Python:**
```bash
pip install langchain langchain-core langchain-community
```

**TypeScript:**
```bash
npm install @langchain/core @langchain/langgraph @langchain/anthropic langchain zod
```

### 3. 工具定义

**Python (装饰器):**
```python
from langchain_core.tools import tool

@tool
def add(a: int, b: int) -> int:
    """两个数相加"""
    return a + b
```

**TypeScript (tool 函数 + Zod):**
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
```

### 4. Agent 创建

**Python:**
```python
from langchain.agents import create_agent

agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[get_weather],
    system_prompt="你是一个有帮助的助手",
)
```

**TypeScript:**
```typescript
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';

const model = new ChatAnthropic({ model: 'claude-sonnet-4-5' });
const agent = createReactAgent({
  model,
  tools: [getWeatherTool],
  stateModifier: '你是一个有帮助的助手',
});
```

### 5. 类型系统

**Python (类型注解):**
```python
def get_weather(city: str) -> str:
    return f"{city} 天气晴朗"
```

**TypeScript (类型安全 + Zod 验证):**
```typescript
const getWeather = tool(
  async ({ city }: { city: string }) => `${city} 天气晴朗`,
  {
    schema: z.object({
      city: z.string().describe('城市名称'),
    }),
  }
);
```

### 6. 环境变量

**Python:**
```python
import os
api_key = os.getenv('ANTHROPIC_API_KEY')
```

**TypeScript:**
```typescript
import * as dotenv from 'dotenv';
dotenv.config();
// process.env.ANTHROPIC_API_KEY
```

---

## 🎯 TypeScript 版本优势

### 1. 类型安全
- 编译时类型检查
- IDE 智能提示
- 运行时 Zod 验证

### 2. 工程化
- ESLint + Prettier 代码规范
- Vitest 单元测试
- 路径别名导入
- 结构化日志

### 3. 模块化
- ESM 模块系统
- 可复用的工具模块
- 清晰的目录结构

### 4. 开发体验
- `npm run dev` 实时编译
- `npm run test:watch` 监听测试
- Git 钩子自动检查

---

## 📦 核心依赖对比

| 功能 | Python 包 | TypeScript 包 |
|------|----------|---------------|
| 核心 | `langchain-core` | `@langchain/core` |
| LangGraph | `langgraph` | `@langchain/langgraph` |
| OpenAI | `langchain-openai` | `@langchain/openai` |
| Anthropic | `langchain-anthropic` | `@langchain/anthropic` |
| 类型验证 | `pydantic` | `zod` |
| 日志 | `logging` | `pino` |
| 测试 | `pytest` | `vitest` |

---

## 🚀 快速迁移步骤

1. **安装 Node.js >= 20**
   ```bash
   node -v
   ```

2. **克隆/更新仓库**
   ```bash
   cd langchain-learning
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 填入 API Key
   ```

5. **运行示例**
   ```bash
   npm run demo:agent
   ```

---

## 📝 代码迁移示例

### 完整示例：天气 Agent

**Python 版本:**
```python
from langchain.agents import create_agent
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """获取城市天气"""
    return f"{city} 今天晴朗"

agent = create_agent(
    model="claude-sonnet-4-5",
    tools=[get_weather],
    system_prompt="你是天气助手",
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "北京天气？"}]
})
```

**TypeScript 版本:**
```typescript
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const getWeather = tool(
  async ({ city }: { city: string }) => `${city} 今天晴朗`,
  {
    name: 'get_weather',
    description: '获取城市天气',
    schema: z.object({
      city: z.string().describe('城市名称'),
    }),
  }
);

const model = new ChatAnthropic({ model: 'claude-sonnet-4-5' });
const agent = createReactAgent({
  model,
  tools: [getWeather],
  stateModifier: '你是天气助手',
});

const result = await agent.invoke({
  messages: [{ role: 'user', content: '北京天气？' }],
});
```

---

## 🔍 常见问题

### Q: 为什么要用 Zod 而不是 TypeScript 类型？

A: TypeScript 类型只在编译时有效，Zod 提供运行时验证。对于 Agent 工具，用户输入是动态的，需要运行时验证。

### Q: 为什么用 `createReactAgent` 而不是 `create_agent`？

A: TypeScript 版本中，`createReactAgent` 是 LangGraph 提供的预构建 Agent，功能更强大，支持状态管理。

### Q: 如何调试？

A: 
1. 设置 `LOG_LEVEL=debug` 查看详细日志
2. 使用 VS Code 调试器
3. 启用 LangSmith 追踪

---

**迁移完成日期**: 2026-03-14  
**维护者**: 你的团队
