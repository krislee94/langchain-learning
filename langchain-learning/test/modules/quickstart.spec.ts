/**
 * 快速入门模块测试 - 第 03 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { QuickstartModule } from '../../nest-src/modules/quickstart/quickstart.module';
import { QuickstartController } from '../../nest-src/modules/quickstart/quickstart.controller';
import { QuickstartService } from '../../nest-src/modules/quickstart/quickstart.service';

describe('QuickstartModule', () => {
  let quickstartController: QuickstartController;
  let quickstartService: QuickstartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [QuickstartModule],
    }).compile();

    quickstartController = module.get<QuickstartController>(QuickstartController);
    quickstartService = module.get<QuickstartService>(QuickstartService);
  });

  it('应该定义快速入门控制器', () => {
    expect(quickstartController).toBeDefined();
  });

  it('应该定义快速入门服务', () => {
    expect(quickstartService).toBeDefined();
  });

  describe('getGuide', () => {
    it('应该返回快速入门指南', () => {
      const result = quickstartController.getGuide();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('example');
      expect(Array.isArray(result.steps)).toBe(true);
    });
  });

  describe('chat', () => {
    it('在没有 API Key 时应该抛出错误', async () => {
      const dto = { prompt: '测试' };
      await expect(quickstartController.chat(dto)).rejects.toThrow();
    });
  });

  describe('createTool', () => {
    it('应该创建简单工具', () => {
      const result = quickstartController.createTool();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
    });
  });
});
