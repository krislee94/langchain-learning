/**
 * 故障排查服务
 */

import { Injectable } from '@nestjs/common';

export interface CommonIssue {
  problem: string;
  cause: string;
  solution: string;
  prevention: string;
}

export interface DebugTip {
  category: string;
  tips: string[];
}

@Injectable()
export class TroubleshootingService {
  getCommonIssues(): CommonIssue[] {
    return [
      {
        problem: 'API Key 错误',
        cause: '环境变量未设置或 Key 过期',
        solution: '检查.env 文件，确认 API Key 正确',
        prevention: '使用配置管理工具，定期轮换 Key',
      },
      {
        problem: 'Token 超限',
        cause: '输入文本过长或上下文累积过多',
        solution: '实现文本截断或摘要策略',
        prevention: '设置 Token 预算，监控使用量',
      },
      {
        problem: '响应超时',
        cause: '网络问题或模型负载高',
        solution: '增加超时时间，实现重试机制',
        prevention: '使用流式输出，设置合理超时',
      },
      {
        problem: '工具调用失败',
        cause: '参数格式错误或工具未注册',
        solution: '检查工具定义和参数 schema',
        prevention: '编写工具单元测试，验证参数',
      },
    ];
  }

  getDebugTips(): DebugTip[] {
    return [
      {
        category: '日志记录',
        tips: [
          '使用结构化日志（pino/winston）',
          '记录请求/响应内容',
          '记录 Token 使用量',
          '设置不同的日志级别',
        ],
      },
      {
        category: '错误处理',
        tips: [
          '捕获并记录所有异常',
          '提供友好的错误信息',
          '实现重试机制',
          '设置熔断器',
        ],
      },
      {
        category: '性能优化',
        tips: [
          '使用缓存减少 API 调用',
          '实现流式输出',
          '批量处理请求',
          '监控响应时间',
        ],
      },
    ];
  }
}
