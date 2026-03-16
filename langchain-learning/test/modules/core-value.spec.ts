/**
 * 核心价值模块测试 - 第 01 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CoreValueModule } from '../../nest-src/modules/core-value/core-value.module';
import { CoreValueController } from '../../nest-src/modules/core-value/core-value.controller';
import { CoreValueService } from '../../nest-src/modules/core-value/core-value.service';

describe('CoreValueModule', () => {
  let coreValueController: CoreValueController;
  let coreValueService: CoreValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreValueModule],
    }).compile();

    coreValueController = module.get<CoreValueController>(CoreValueController);
    coreValueService = module.get<CoreValueService>(CoreValueService);
  });

  it('应该定义核心价值控制器', () => {
    expect(coreValueController).toBeDefined();
  });

  it('应该定义核心价值服务', () => {
    expect(coreValueService).toBeDefined();
  });

  describe('getProviders', () => {
    it('应该返回支持的模型提供商列表', () => {
      const result = coreValueController.getProviders();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('model');
      expect(result[0]).toHaveProperty('description');
    });
  });

  describe('compareProviders', () => {
    it('应该返回提供商比较结果', () => {
      const result = coreValueController.compareProviders();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('providers');
      expect(result).toHaveProperty('unifiedInterface');
      expect(Array.isArray(result.providers)).toBe(true);
    });
  });

  describe('useAnthropic', () => {
    it('在没有 API Key 时应该抛出错误', async () => {
      const dto = { prompt: '测试' };
      await expect(coreValueController.useAnthropic(dto)).rejects.toThrow();
    });
  });

  describe('useOpenAI', () => {
    it('在没有 API Key 时应该抛出错误', async () => {
      const dto = { prompt: '测试' };
      await expect(coreValueController.useOpenAI(dto)).rejects.toThrow();
    });
  });
});
