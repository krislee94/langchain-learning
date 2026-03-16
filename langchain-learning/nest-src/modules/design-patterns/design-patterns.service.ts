/**
 * 设计模式服务
 */

import { Injectable } from '@nestjs/common';

export interface DesignPattern {
  name: string;
  description: string;
  useCase: string;
  example: string;
}

@Injectable()
export class DesignPatternsService {
  getPatterns(): DesignPattern[] {
    return [
      {
        name: 'Chain of Responsibility',
        description: '链式责任模式 - 多个处理者依次处理请求',
        useCase: 'LLM 链式调用、中间件处理',
        example: 'prompt.pipe(model).pipe(outputParser)',
      },
      {
        name: 'Strategy',
        description: '策略模式 - 动态切换算法/模型',
        useCase: '多模型切换、不同 embedding 策略',
        example: 'context.setModel(strategy.getModel())',
      },
      {
        name: 'Factory',
        description: '工厂模式 - 统一创建对象',
        useCase: '创建不同类型的 LLM 实例',
        example: 'LLMFactory.create("anthropic")',
      },
      {
        name: 'Observer',
        description: '观察者模式 - 事件通知',
        useCase: 'LangSmith 回调、日志记录',
        example: 'callbacks.addHandler(myHandler)',
      },
      {
        name: 'Adapter',
        description: '适配器模式 - 统一接口',
        useCase: '不同向量数据库的统一接口',
        example: 'VectorStoreAdapter.wrap(pinecone)',
      },
    ];
  }

  async demonstrateChain(text: string): Promise<string> {
    // 模拟链式处理
    const step1 = `[Step1] 接收：${text}`;
    const step2 = `[Step2] 处理：${text.toUpperCase()}`;
    const step3 = `[Step3] 输出：${step2}`;
    return `${step1} → ${step2} → ${step3}`;
  }
}
