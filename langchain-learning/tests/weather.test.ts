/**
 * 天气工具测试
 */

import { describe, it, expect } from 'vitest';
import { weatherTool, batchWeatherTool } from '../src/tools/weather.js';

describe('Weather Tools', () => {
  describe('weatherTool', () => {
    it('应该返回北京的天气', async () => {
      const result = await weatherTool.invoke({ city: '北京' });
      expect(result).toContain('晴朗');
      expect(result).toContain('温度');
    });

    it('应该返回上海的天气', async () => {
      const result = await weatherTool.invoke({ city: '上海' });
      expect(result).toContain('多云');
    });

    it('应该处理未知城市', async () => {
      const result = await weatherTool.invoke({ city: '未知城市' });
      expect(result).toContain('数据暂不可用');
    });
  });

  describe('batchWeatherTool', () => {
    it('应该批量返回多个城市天气', async () => {
      const result = await batchWeatherTool.invoke({
        cities: ['北京', '上海'],
      });
      const parsed = JSON.parse(result as string);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(2);
    });

    it('应该处理混合城市（已知 + 未知）', async () => {
      const result = await batchWeatherTool.invoke({
        cities: ['北京', '未知城市'],
      });
      const parsed = JSON.parse(result as string);
      expect(parsed[0].city).toBe('北京');
      expect(parsed[1].weather).toContain('数据暂不可用');
    });
  });
});
