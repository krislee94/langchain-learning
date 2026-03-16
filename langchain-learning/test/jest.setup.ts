/**
 * Jest 测试配置
 */

import 'reflect-metadata';

// 全局测试超时
jest.setTimeout(10000);

// Mock console.error 以减少测试噪音
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
