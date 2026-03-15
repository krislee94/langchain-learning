/**
 * 工具集合索引
 *
 * 导出所有可用工具
 */

// 天气工具
export { weatherTool, batchWeatherTool } from './weather.js';

// 计算器工具
export { calculateTool, addTool, subtractTool, multiplyTool, divideTool } from './calculator.js';

// 时间工具
export { getTimeTool, getDateTool, daysBetweenTool } from './time.js';

// 工具集合（方便批量导入）
export const allTools = [
  // 天气
  // weatherTool,
  // batchWeatherTool,
  // 计算器
  // calculateTool,
  // addTool,
  // subtractTool,
  // multiplyTool,
  // divideTool,
  // 时间
  // getTimeTool,
  // getDateTool,
  // daysBetweenTool,
];
