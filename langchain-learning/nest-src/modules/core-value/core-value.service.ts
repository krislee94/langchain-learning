/**
 * 核心价值服务
 * 演示 LangChain 统一模型接口
 */

import { Injectable } from '@nestjs/common';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';

export interface ModelProvider {
  name: string;
  model: string;
  description: string;
}

export interface ModelResponse {
  provider: string;
  model: string;
  content: string;
  timestamp: string;
}

export interface CompareResult {
  providers: ModelProvider[];
  unifiedInterface: string;
}

@Injectable()
export class CoreValueService {
  private readonly providers: ModelProvider[] = [
    {
      name: 'Anthropic Claude',
      model: 'claude-sonnet-4-5-20260128',
      description: 'Anthropic 公司的 Claude 模型，擅长推理和代码',
    },
    {
      name: 'OpenAI GPT',
      model: 'gpt-4o',
      description: 'OpenAI 的 GPT-4o 模型，多模态能力强',
    },
    {
      name: 'Google Gemini',
      model: 'gemini-2.0-flash',
      description: 'Google 的 Gemini 模型，速度快成本低',
    },
  ];

  /**
   * 获取所有支持的模型提供商
   */
  getProviders(): ModelProvider[] {
    return this.providers;
  }

  /**
   * 使用 Anthropic Claude 模型
   */
  async useAnthropic(prompt: string): Promise<ModelResponse> {
    try {
      const model = new ChatAnthropic({
        model: 'claude-sonnet-4-5-20260128',
        temperature: 0.7,
        maxTokens: 1024,
      });

      const response = await model.invoke([new HumanMessage(prompt)]);

      return {
        provider: 'Anthropic',
        model: 'claude-sonnet-4-5-20260128',
        content: response.content as string,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Anthropic 调用失败：${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * 使用 OpenAI GPT 模型
   */
  async useOpenAI(prompt: string): Promise<ModelResponse> {
    try {
      const model = new ChatOpenAI({
        model: 'gpt-4o',
        temperature: 0.7,
      });

      const response = await model.invoke([new HumanMessage(prompt)]);

      return {
        provider: 'OpenAI',
        model: 'gpt-4o',
        content: response.content as string,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `OpenAI 调用失败：${error instanceof Error ? error.message : '未知错误'}`,
      );
    }
  }

  /**
   * 比较不同模型提供商
   */
  compareProviders(): CompareResult {
    return {
      providers: this.providers,
      unifiedInterface: `
LangChain 的核心价值：标准化接口

所有模型都遵循相同的模式：
  1. 导入对应的模型类
  2. 实例化模型（传入 model 名称和参数）
  3. 调用 invoke 方法（传入消息列表）
  4. 从 response.content 获取回复

切换模型只需改一行代码！
      `.trim(),
    };
  }
}
