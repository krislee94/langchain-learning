/**
 * 实验 2-2:创建自定义工具
 *
 * 学习如何定义和使用 LangChain 工具
 *
 * 运行方式:
 *   npx tsx 02-architecture/demos/02-custom-tool.ts
 *
 * 环境要求:
 *   - ANTHROPIC_API_KEY 或 OPENAI_API_KEY (用于 Agent 演示)
 */

import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// 方法 1:使用 tool() 函数（最简单）
// ============================================================================

/**
 * 两个数相加
 */
const add = tool(async ({ a, b }: { a: number; b: number }) => a + b, {
  name: 'add',
  description: '两个数相加',
  schema: z.object({
    a: z.number().describe('第一个加数'),
    b: z.number().describe('第二个加数'),
  }),
});

/**
 * 两个数相乘
 */
const multiply = tool(async ({ a, b }: { a: number; b: number }) => a * b, {
  name: 'multiply',
  description: '两个数相乘',
  schema: z.object({
    a: z.number().describe('第一个乘数'),
    b: z.number().describe('第二个乘数'),
  }),
});

// ============================================================================
// 方法 2:带详细描述的 tool
// ============================================================================

/**
 * 计算矩形面积
 */
const calculateArea = tool(
  async ({ length, width }: { length: number; width: number }) => {
    const area = length * width;
    return `面积:${length}m × ${width}m = ${area}m²`;
  },
  {
    name: 'calculate_area',
    description: '计算矩形面积并返回描述字符串',
    schema: z.object({
      length: z.number().describe('长度（米）'),
      width: z.number().describe('宽度（米）'),
    }),
  }
);

// ============================================================================
// 方法 3:使用自定义 Zod Schema
// ============================================================================

/**
 * 搜索参数 Schema
 */
const SearchArgsSchema = z.object({
  query: z.string().describe('搜索关键词'),
  limit: z.number().default(5).describe('返回结果数量，最大 10'),
});

/**
 * 搜索信息
 */
const searchInfo = tool(
  async ({ query, limit }: { query: string; limit: number }) => {
    // 模拟搜索
    return `搜索结果（前${limit}条）关于'${query}'`;
  },
  {
    name: 'search_info',
    description: '搜索信息',
    schema: SearchArgsSchema,
  }
);

// ============================================================================
// 方法 4:使用 tool() 创建复杂工具
// ============================================================================

/**
 * 打招呼工具
 */
const greetTool = tool(
  async ({ name, greeting }: { name: string; greeting?: string }) => {
    const actualGreeting = greeting ?? '你好';
    return `${actualGreeting}, ${name}!`;
  },
  {
    name: 'greet_person',
    description: '向某人打招呼',
    schema: z.object({
      name: z.string().describe('要打招呼的人名'),
      greeting: z.string().optional().default('你好').describe('问候语'),
    }),
  }
);

// ============================================================================
// 演示函数
// ============================================================================

/**
 * 检查工具属性
 */
async function demoToolInspection() {
  console.log('='.repeat(60));
  console.log('工具属性检查');
  console.log('='.repeat(60));

  const tools = [add, multiply, calculateArea, searchInfo, greetTool];

  for (const toolFunc of tools) {
    console.log(`\n工具:${toolFunc.name}`);
    console.log(`  描述:${toolFunc.description}`);
    console.log(`  参数 Schema: ${JSON.stringify(toolFunc.schema, null, 2)}`);
  }
}

/**
 * 演示工具执行
 */
async function demoToolExecution() {
  console.log('\n' + '='.repeat(60));
  console.log('工具执行演示');
  console.log('='.repeat(60));

  // 直接调用
  console.log(`\nadd(3, 5) = ${await add.invoke({ a: 3, b: 5 })}`);
  console.log(`multiply(4, 7) = ${await multiply.invoke({ a: 4, b: 7 })}`);
  console.log(`calculate_area(10, 5) = ${await calculateArea.invoke({ length: 10, width: 5 })}`);
  console.log(`search_info('AI') = ${await searchInfo.invoke({ query: 'AI', limit: 3 })}`);
  console.log(`greet_tool('张三') = ${await greetTool.invoke({ name: '张三' })}`);
}

/**
 * 演示在 Agent 中使用工具
 */
async function demoToolInAgent() {
  console.log('\n' + '='.repeat(60));
  console.log('在 Agent 中使用工具');
  console.log('='.repeat(60));

  try {
    const llm = new ChatAnthropic({
      model: 'claude-sonnet-4-5-20260128',
      temperature: 0,
    });

    const agent = createReactAgent({
      llm,
      tools: [add, multiply, calculateArea],
      stateModifier: '你是数学助手，可以帮助计算。',
    });

    // 测试
    const result = await agent.invoke({
      messages: [{ role: 'user' as const, content: '3 加 5 等于多少？' }],
    });

    console.log('\n问题:3 加 5 等于多少？');
    if ('messages' in result && Array.isArray(result.messages)) {
      const lastMessage = result.messages[result.messages.length - 1];
      if (lastMessage && 'content' in lastMessage) {
        console.log(`回复:${lastMessage.content}`);
      }
    }
  } catch (error) {
    console.log(`需要设置 API KEY: ${error instanceof Error ? error.message : error}`);
  }
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('LangChain 学习 - 实验 2-2:创建自定义工具\n');

  await demoToolInspection();
  await demoToolExecution();
  await demoToolInAgent();

  console.log('\n' + '='.repeat(60));
  console.log('关键收获:');
  console.log('='.repeat(60));
  console.log(`
1. 使用 tool() 函数快速创建类型安全的工具

2. 工具需要:
   - 名称（name 属性）
   - 描述（description 属性）
   - 参数 schema（使用 Zod 定义）

3. 可以使用自定义 Zod Schema 进行复杂参数验证

4. 工具可以直接调用或通过 Agent 调用

5. TypeScript + Zod 提供编译时和运行时双重类型保障
  `);
}

// 运行主函数
main().catch(console.error);
