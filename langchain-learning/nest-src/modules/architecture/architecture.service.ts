/**
 * 架构服务
 * 演示消息传递和工具创建
 */

import { Injectable } from '@nestjs/common';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export interface MessageType {
  type: string;
  role: string;
  content: string;
}

export interface MessageFlow {
  types: MessageType[];
  flow: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  schema: string;
}

@Injectable()
export class ArchitectureService {
  /**
   * 获取消息类型演示
   */
  getMessageTypes(): MessageFlow {
    return {
      types: [
        { type: 'SystemMessage', role: 'system', content: '系统指令' },
        { type: 'HumanMessage', role: 'user', content: '用户输入' },
        { type: 'AIMessage', role: 'assistant', content: 'AI 回复' },
      ],
      flow: [
        '用户输入 → HumanMessage',
        'HumanMessage + SystemMessage → 发送给 LLM',
        'LLM 回复 → AIMessage',
        'AIMessage 添加到历史',
        '下一轮对话包含所有历史消息',
      ],
    };
  }

  /**
   * 创建提示词模板
   */
  async createPromptTemplate(
    role: string,
    style: string,
    question: string,
  ): Promise<string[]> {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', '你是{role}，{style}'],
      ['human', '{question}'],
    ]);

    const formatted = await prompt.invoke({ role, style, question });
    const messages = Array.isArray(formatted)
      ? formatted
      : (formatted as { messages?: unknown[] }).messages || [];

    return messages.map((msg: { content?: unknown }) =>
      typeof msg.content === 'string' ? msg.content : '[复杂内容]',
    );
  }

  /**
   * 创建计算器工具
   */
  createCalculatorTools(): ToolDefinition[] {
    const add = tool(
      async ({ a, b }: { a: number; b: number }) => a + b,
      {
        name: 'add',
        description: '两个数相加',
        schema: z.object({
          a: z.number().describe('第一个加数'),
          b: z.number().describe('第二个加数'),
        }),
      },
    );

    const multiply = tool(
      async ({ a, b }: { a: number; b: number }) => a * b,
      {
        name: 'multiply',
        description: '两个数相乘',
        schema: z.object({
          a: z.number().describe('第一个乘数'),
          b: z.number().describe('第二个乘数'),
        }),
      },
    );

    return [
      {
        name: add.name,
        description: add.description,
        schema: JSON.stringify(add.schema),
      },
      {
        name: multiply.name,
        description: multiply.description,
        schema: JSON.stringify(multiply.schema),
      },
    ];
  }

  /**
   * 执行工具
   */
  async executeTool(
    toolName: string,
    params: Record<string, unknown>,
  ): Promise<unknown> {
    const tools = {
      add: tool(async ({ a, b }: { a: number; b: number }) => a + b, {
        name: 'add',
        description: '两个数相加',
        schema: z.object({
          a: z.number(),
          b: z.number(),
        }),
      }),
      multiply: tool(async ({ a, b }: { a: number; b: number }) => a * b, {
        name: 'multiply',
        description: '两个数相乘',
        schema: z.object({
          a: z.number(),
          b: z.number(),
        }),
      }),
    };

    const tool = tools[toolName as keyof typeof tools];
    if (!tool) {
      throw new Error(`工具 ${toolName} 不存在`);
    }

    return tool.invoke(params);
  }
}
