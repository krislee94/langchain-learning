/**
 * 组件服务 - 演示 LangChain 六大核心组件
 */

import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatAnthropic } from '@langchain/anthropic';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export interface ComponentInfo {
  name: string;
  description: string;
  example: string;
}

@Injectable()
export class ComponentsService {
  getComponents(): ComponentInfo[] {
    return [
      {
        name: 'Models',
        description: 'LLM 模型抽象层',
        example: 'new ChatAnthropic({ model: "claude-sonnet-4-5" })',
      },
      {
        name: 'Prompts',
        description: '提示词模板管理',
        example: 'ChatPromptTemplate.fromMessages([...])',
      },
      {
        name: 'Chains',
        description: '链式调用组合',
        example: 'prompt.pipe(model).pipe(outputParser)',
      },
      {
        name: 'Agents',
        description: '自主决策的 AI 助手',
        example: 'createReactAgent({ llm, tools })',
      },
      {
        name: 'Memory',
        description: '对话历史记忆',
        example: 'BufferMemory, VectorStoreRetrieverMemory',
      },
      {
        name: 'Retrievers',
        description: '信息检索系统',
        example: 'vectorStore.asRetriever()',
      },
    ];
  }

  async demonstratePrompt(): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(
      '翻译以下文本到{language}: {text}',
    );
    const formatted = await prompt.invoke({
      language: '英文',
      text: '你好，世界',
    });
    return formatted.toString();
  }

  async demonstrateChain(text: string): Promise<string> {
    const prompt = ChatPromptTemplate.fromTemplate(
      '将以下文本转换为{style}风格：{text}',
    );
    const model = new ChatAnthropic({
      model: 'claude-sonnet-4-5-20260128',
      temperature: 0.7,
    });
    const chain = prompt.pipe(model);
    const response = await chain.invoke({ style: '正式', text });
    return response.content as string;
  }

  createDemoTool() {
    return tool(
      async ({ query }: { query: string }) => `搜索"${query}"的结果`,
      {
        name: 'demo_search',
        description: '演示搜索工具',
        schema: z.object({
          query: z.string().describe('搜索关键词'),
        }),
      },
    );
  }
}
