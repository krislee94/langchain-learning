/**
 * 计算器工具测试
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTool,
  addTool,
  subtractTool,
  multiplyTool,
  divideTool,
} from '../src/tools/calculator.js';

describe('Calculator Tools', () => {
  describe('addTool', () => {
    it('应该正确计算两个正数相加', async () => {
      const result = await addTool.invoke({ a: 3, b: 5 });
      expect(result).toBe(8);
    });

    it('应该正确处理负数', async () => {
      const result = await addTool.invoke({ a: -3, b: 5 });
      expect(result).toBe(2);
    });

    it('应该正确处理小数', async () => {
      const result = await addTool.invoke({ a: 1.5, b: 2.5 });
      expect(result).toBe(4);
    });
  });

  describe('subtractTool', () => {
    it('应该正确计算减法', async () => {
      const result = await subtractTool.invoke({ a: 10, b: 3 });
      expect(result).toBe(7);
    });

    it('应该正确处理负数结果', async () => {
      const result = await subtractTool.invoke({ a: 3, b: 10 });
      expect(result).toBe(-7);
    });
  });

  describe('multiplyTool', () => {
    it('应该正确计算乘法', async () => {
      const result = await multiplyTool.invoke({ a: 4, b: 7 });
      expect(result).toBe(28);
    });

    it('应该正确处理零', async () => {
      const result = await multiplyTool.invoke({ a: 100, b: 0 });
      expect(result).toBe(0);
    });
  });

  describe('divideTool', () => {
    it('应该正确计算除法', async () => {
      const result = await divideTool.invoke({ a: 20, b: 4 });
      expect(result).toBe('20 ÷ 4 = 5');
    });

    it('应该处理除数为零', async () => {
      const result = await divideTool.invoke({ a: 10, b: 0 });
      expect(result).toBe('错误：除数不能为零');
    });

    it('应该正确处理小数结果', async () => {
      const result = await divideTool.invoke({ a: 10, b: 3 });
      expect(result).toContain('3.333');
    });
  });

  describe('calculateTool', () => {
    it('应该计算简单表达式', async () => {
      const result = await calculateTool.invoke({ expression: '2 + 2' });
      expect(result).toBe('2 + 2 = 4');
    });

    it('应该计算复杂表达式', async () => {
      const result = await calculateTool.invoke({ expression: '(10 + 5) * 2' });
      expect(result).toBe('(10 + 5) * 2 = 30');
    });

    it('应该处理错误表达式', async () => {
      const result = await calculateTool.invoke({ expression: '2 + + 2' });
      expect(result).toContain('计算错误');
    });
  });
});
