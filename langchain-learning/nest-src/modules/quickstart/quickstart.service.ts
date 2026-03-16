/**
 * 快速入门服务
 */

import { Injectable } from '@nestjs/common';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export interface QuickstartGuide {
  steps: string[];
  example: string;
}

@Injectable()
export class QuickstartService {
  getQuickstartGuide(): QuickstartGuide {
    return {
      steps: [
        '1. 安装依赖：npm install @langchain/core @langchain/anthropic',
        '2. 设置 API Key: export ANTHROPIC_API_KEY=sk-...',
        '3. 创建模型实例',
        '4. 调用 invoke 方法',
        '5. 获取响应',
      ],
      example: `
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';

const model = new ChatAnthropic({ model: 'claude-sonnet-4-5' });
const response = await model.invoke([new HumanMessage('你好')]);
console.log(response.content);
      `.trim(),
    };
  }

  async simpleChat(prompt: string): Promise<string> {
    const model = new ChatAnthropic({
      model: 'claude-sonnet-4-5-20260128',
      temperature: 0.7,
    });
    const response = await model.invoke([new HumanMessage(prompt)]);
    return response.content as string;
  }

  createSimpleTool() {
    return tool(
      async ({ input }: { input: string }) => `处理结果：${input}`,
      {
        name: 'simple_tool',
        description: '简单工具示例',
        schema: z.object({
          input: z.string().describe('输入内容'),
        }),
      },
    );
  }
}
