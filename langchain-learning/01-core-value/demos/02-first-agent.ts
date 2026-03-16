/**
 * 实验 1-2:创建第一个 Agent
 *
 * 目标:10 行代码创建能使用工具的 AI 助手
 *
 * 运行方式:
 *   npx tsx 01-core-value/demos/02-first-agent.ts
 *
 * 环境要求:
 *   - ANTHROPIC_API_KEY 或 OPENAI_API_KEY
 */

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// 定义工具函数
// ============================================================================

/**
 * 获取指定城市的天气信息
 */
const getWeather = tool(
  async ({ city }: { city: string }) => {
    // 模拟数据，实际可以调用天气 API
    const weatherData: Record<string, string> = {
      北京: '晴朗，温度 25°C，湿度 40%',
      上海: '多云，温度 22°C，湿度 65%',
      广州: '小雨，温度 28°C，湿度 80%',
      深圳: '晴朗，温度 30°C，湿度 70%',
    };
    return weatherData[city] ?? `${city} 天气数据暂不可用`;
  },
  {
    name: 'get_weather',
    description: '获取指定城市的天气信息',
    schema: z.object({
      city: z.string().describe('城市名称，如"北京"、"上海"'),
    }),
  }
);

/**
 * 获取当前时间
 */
const getTime = tool(
  async () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },
  {
    name: 'get_time',
    description: '获取当前时间',
    schema: z.object({}),
  }
);

/**
 * 计算数学表达式
 */
const calculate = tool(
  async ({ expression }: { expression: string }) => {
    try {
      // 安全的表达式求值（仅支持基本运算）
      const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
      const result = Function(`'use strict'; return (${sanitized})`)();
      return `${expression} = ${result}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return `计算错误:${errorMessage}`;
    }
  },
  {
    name: 'calculate',
    description: '计算数学表达式',
    schema: z.object({
      expression: z.string().describe('数学表达式，如"2+2"、"10*5"'),
    }),
  }
);

// ============================================================================
// 创建 Agent
// ============================================================================

/**
 * 创建一个包含多个工具的 Agent
 */
export function createMyAgent() {
  const llm = new ChatAnthropic({
    model: 'claude-sonnet-4-5-20260128',
    temperature: 0,
  });

  const tools = [getWeather, getTime, calculate];

  const systemPrompt = `你是一个有帮助的助手，可以:
1. 查询天气（使用 get_weather 工具）
2. 告诉用户当前时间（使用 get_time 工具）
3. 进行数学计算（使用 calculate 工具）

请用友好、简洁的方式回答用户问题。
如果需要使用工具，请正确调用。`;

  return createReactAgent({
    llm,
    tools,
    stateModifier: systemPrompt,
  });
}

// ============================================================================
// 测试 Agent
// ============================================================================

/**
 * 测试 Agent 的各种能力
 */
async function testAgent() {
  console.log('='.repeat(60));
  console.log('LangChain 学习 - 实验 1-2:创建第一个 Agent');
  console.log('='.repeat(60));

  try {
    const agent = createMyAgent();

    // 测试问题列表
    const testQuestions = [
      '北京今天天气怎么样？',
      '现在几点了？',
      '帮我算一下 123 * 456 等于多少',
      '上海和广州的天气哪个更好？',
    ];

    for (const question of testQuestions) {
      console.log(`\n📝 问题:${question}`);
      console.log('-'.repeat(60));

      const result = await agent.invoke({
        messages: [{ role: 'user' as const, content: question }],
      });

      // 提取回复
      if ('messages' in result && Array.isArray(result.messages)) {
        const lastMessage = result.messages[result.messages.length - 1];
        if (lastMessage && 'content' in lastMessage) {
          console.log(`🤖 回复:${lastMessage.content}`);
        }
      }

      console.log();
    }
  } catch (error) {
    console.log('需要设置 API KEY 环境变量');
    console.log(`错误:${error instanceof Error ? error.message : error}`);
    console.log('\n请设置以下环境变量之一:');
    console.log('  - ANTHROPIC_API_KEY (使用 Claude)');
    console.log('  - OPENAI_API_KEY (使用 GPT)');
  }
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  await testAgent();

  console.log('\n' + '='.repeat(60));
  console.log('实验完成！');
  console.log('='.repeat(60));
  console.log(`
关键收获:
1. 使用 createReactAgent 只需几行代码创建 Agent
2. 使用 tool() 函数和 Zod schema 定义类型安全的工具
3. Agent 会自动决定何时调用哪个工具
4. stateModifier 可以指导 Agent 的行为风格

下一步:
- 尝试添加更多工具
- 修改 stateModifier 改变 Agent 人设
- 使用真实的 API（天气、新闻等）
  `);
}

// 运行主函数
main().catch(console.error);
