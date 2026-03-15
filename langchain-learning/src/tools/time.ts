/**
 * 时间工具
 *
 * 提供时间相关功能
 */

import { tool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * 获取当前时间工具
 */
export const getTimeTool = tool(
  async () => {
    const now = new Date();
    return now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  },
  {
    name: 'get_time',
    description: '获取当前时间',
    schema: z.object({}),
  }
);

/**
 * 获取当前日期工具
 */
export const getDateTool = tool(
  async () => {
    const now = new Date();
    return now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  },
  {
    name: 'get_date',
    description: '获取当前日期',
    schema: z.object({}),
  }
);

/**
 * 计算两个日期之间的天数
 */
export const daysBetweenTool = tool(
  async ({ date1, date2 }: { date1: string; date2: string }) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${date1} 和 ${date2} 之间相差 ${diffDays} 天`;
  },
  {
    name: 'days_between',
    description: '计算两个日期之间的天数',
    schema: z.object({
      date1: z.string().describe('第一个日期 (ISO 格式)'),
      date2: z.string().describe('第二个日期 (ISO 格式)'),
    }),
  }
);
