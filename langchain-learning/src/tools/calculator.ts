/**
 * 计算器工具
 *
 * 提供数学计算功能
 */

import { tool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * 安全的数学表达式求值
 */
function safeEvaluate(expression: string): number {
  const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');

  return Function(`'use strict'; return (${sanitized})`)();
}

/**
 * 基础计算工具
 */
export const calculateTool = tool(
  async ({ expression }: { expression: string }) => {
    try {
      const result = safeEvaluate(expression);
      return `${expression} = ${result}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return `计算错误：${errorMessage}`;
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

/**
 * 加法工具
 */
export const addTool = tool(async ({ a, b }: { a: number; b: number }) => a + b, {
  name: 'add',
  description: '两个数相加',
  schema: z.object({
    a: z.number().describe('第一个加数'),
    b: z.number().describe('第二个加数'),
  }),
});

/**
 * 减法工具
 */
export const subtractTool = tool(async ({ a, b }: { a: number; b: number }) => a - b, {
  name: 'subtract',
  description: '两个数相减',
  schema: z.object({
    a: z.number().describe('被减数'),
    b: z.number().describe('减数'),
  }),
});

/**
 * 乘法工具
 */
export const multiplyTool = tool(async ({ a, b }: { a: number; b: number }) => a * b, {
  name: 'multiply',
  description: '两个数相乘',
  schema: z.object({
    a: z.number().describe('第一个乘数'),
    b: z.number().describe('第二个乘数'),
  }),
});

/**
 * 除法工具
 */
export const divideTool = tool(
  async ({ a, b }: { a: number; b: number }) => {
    if (b === 0) {
      return '错误：除数不能为零';
    }
    return `${a} ÷ ${b} = ${a / b}`;
  },
  {
    name: 'divide',
    description: '两个数相除',
    schema: z.object({
      a: z.number().describe('被除数'),
      b: z.number().describe('除数'),
    }),
  }
);
