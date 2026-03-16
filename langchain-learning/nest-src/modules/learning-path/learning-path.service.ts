/**
 * 学习路径服务
 */

import { Injectable } from '@nestjs/common';

export interface LearningStage {
  level: string;
  name: string;
  duration: string;
  topics: string[];
  goals: string[];
}

export interface Resource {
  type: string;
  title: string;
  url: string;
  description: string;
}

@Injectable()
export class LearningPathService {
  getLearningPath(): LearningStage[] {
    return [
      {
        level: '初级',
        name: '基础入门',
        duration: '1-2 周',
        topics: [
          'LangChain 简介和安装',
          '模型调用基础',
          '提示词模板',
          '简单工具创建',
        ],
        goals: [
          '能够调用 LLM API',
          '理解消息格式',
          '创建基础工具',
        ],
      },
      {
        level: '中级',
        name: '组件深入',
        duration: '2-4 周',
        topics: [
          'Chain 链式调用',
          'Agent 自主决策',
          'Memory 记忆系统',
          'Retriever 检索',
        ],
        goals: [
          '构建复杂 Chain',
          '创建 Agent 应用',
          '实现 RAG 系统',
        ],
      },
      {
        level: '高级',
        name: '生产实战',
        duration: '4-8 周',
        topics: [
          'LangGraph 工作流',
          '多 Agent 协作',
          '性能优化',
          '监控与调试',
        ],
        goals: [
          '设计复杂工作流',
          '部署生产应用',
          '性能调优',
        ],
      },
    ];
  }

  getResources(): Resource[] {
    return [
      {
        type: '官方文档',
        title: 'LangChain.js Docs',
        url: 'https://js.langchain.com/',
        description: '最权威的官方文档',
      },
      {
        type: '官方文档',
        title: 'LangGraph Docs',
        url: 'https://langchain-ai.github.io/langgraphjs/',
        description: 'LangGraph 工作流编排',
      },
      {
        type: 'GitHub',
        title: 'LangChain.js',
        url: 'https://github.com/langchain-ai/langchainjs',
        description: '源码和示例',
      },
      {
        type: '社区',
        title: 'Discord',
        url: 'https://discord.gg/langchain',
        description: '官方社区讨论',
      },
    ];
  }
}
