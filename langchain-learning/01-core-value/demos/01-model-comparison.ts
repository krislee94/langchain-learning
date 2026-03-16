/**
 * 实验 1-1：比较不同模型提供商
 *
 * 目标：理解 LangChain 统一模型接口的价值
 *
 * 运行方式：
 *   npx tsx 01-core-value/demos/01-model-comparison.ts
 *
 * 环境要求：
 *   - ANTHROPIC_API_KEY (Claude)
 *   - OPENAI_API_KEY (GPT)
 *   - GOOGLE_API_KEY (Gemini)
 */

import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================================================
// 演示函数
// ============================================================================

/**
 * Anthropic Claude 示例
 */
async function demoAnthropic() {
  console.log('='.repeat(50));
  console.log('Anthropic Claude 示例');
  console.log('='.repeat(50));

  try {
    const model = new ChatAnthropic({
      model: 'claude-sonnet-4-5-20260128',
      temperature: 0.7,
      maxTokens: 1024,
    });

    const response = await model.invoke([new HumanMessage('用一句话介绍你自己')]);

    console.log(`Claude 回复：${response.content}`);
  } catch (error) {
    console.log('需要设置 ANTHROPIC_API_KEY 环境变量');
    console.log(`错误：${error instanceof Error ? error.message : error}`);
  }
}

/**
 * OpenAI GPT 示例
 */
async function demoOpenAI() {
  console.log('\n' + '='.repeat(50));
  console.log('OpenAI GPT 示例');
  console.log('='.repeat(50));

  try {
    const model = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.7,
    });

    const response = await model.invoke([new HumanMessage('用一句话介绍你自己')]);

    console.log(`GPT 回复：${response.content}`);
  } catch (error) {
    console.log('需要设置 OPENAI_API_KEY 环境变量');
    console.log(`错误：${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Google Gemini 示例
 */
async function demoGoogle() {
  console.log('\n' + '='.repeat(50));
  console.log('Google Gemini 示例');
  console.log('='.repeat(50));

  try {
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.0-flash',
      temperature: 0.7,
    });

    const response = await model.invoke([new HumanMessage('用一句话介绍你自己')]);

    console.log(`Gemini 回复：${response.content}`);
  } catch (error) {
    console.log('需要设置 GOOGLE_API_KEY 环境变量');
    console.log(`错误：${error instanceof Error ? error.message : error}`);
  }
}

/**
 * 统一接口演示
 *
 * 展示 LangChain 的核心价值：统一的模型接口
 *
 * 无论使用哪个提供商，代码结构完全相同：
 * 1. 导入对应的模型类
 * 2. 实例化模型（传入 model 名称和参数）
 * 3. 调用 invoke 方法（传入消息列表）
 * 4. 从 response.content 获取回复
 */
function demoUnifiedInterface() {
  console.log('\n' + '='.repeat(50));
  console.log('统一接口演示');
  console.log('='.repeat(50));

  console.log(`
LangChain 的核心价值之一：标准化接口

所有模型都遵循相同的模式：

    import { ChatXXX } from '@langchain/xxx';
    import { HumanMessage } from '@langchain/core/messages';
    
    const model = new ChatXXX({ model: 'xxx', temperature: 0.7 });
    const response = await model.invoke([new HumanMessage('你好')]);
    console.log(response.content);

切换模型只需改一行代码！
  `);
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  console.log('LangChain 学习 - 实验 1-1：比较不同模型');
  console.log('本实验展示 LangChain 统一模型接口的价值\n');

  // 运行演示（需要对应的 API KEY）
  await demoAnthropic();
  await demoOpenAI();
  await demoGoogle();
  demoUnifiedInterface();

  console.log('\n' + '='.repeat(50));
  console.log('实验完成！');
  console.log('='.repeat(50));
  console.log(`
关键收获：
1. LangChain 为不同 LLM 提供商提供统一接口
2. 切换模型只需更改导入和实例化代码
3. 消息格式和调用方式保持一致
4. 避免供应商锁定，便于测试和比较
  `);
}

// 运行主函数
main().catch(console.error);
