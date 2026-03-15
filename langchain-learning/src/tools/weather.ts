/**
 * 天气工具
 *
 * 提供天气查询功能
 */

import { tool } from '@langchain/core/tools';
import { z } from 'zod';

/**
 * 模拟天气数据
 * 实际使用时可以替换为真实 API 调用
 */
const weatherData: Record<string, string> = {
  北京: '晴朗，温度 25°C，湿度 40%',
  上海: '多云，温度 22°C，湿度 65%',
  广州: '小雨，温度 28°C，湿度 80%',
  深圳: '晴朗，温度 30°C，湿度 70%',
  杭州: '阴天，温度 20°C，湿度 55%',
  成都: '多云，温度 23°C，湿度 60%',
};

/**
 * 天气查询工具
 */
export const weatherTool = tool(
  async ({ city }: { city: string }) => {
    // TODO: 替换为真实 API 调用
    // 例如：https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}
    return weatherData[city] ?? `${city} 天气数据暂不可用`;
  },
  {
    name: 'get_weather',
    description: '获取指定城市的天气信息',
    schema: z.object({
      city: z.string().describe('城市名称，如"北京"、"上海"'),
    }),
  }
);

/**
 * 批量天气查询工具
 */
export const batchWeatherTool = tool(
  async ({ cities }: { cities: string[] }) => {
    const results = cities.map((city) => ({
      city,
      weather: weatherData[city] ?? '数据暂不可用',
    }));
    return JSON.stringify(results, null, 2);
  },
  {
    name: 'get_batch_weather',
    description: '批量获取多个城市的天气信息',
    schema: z.object({
      cities: z.array(z.string()).describe('城市名称列表'),
    }),
  }
);
