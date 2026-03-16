/**
 * 设计模式模块测试 - 第 05 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { DesignPatternsModule } from '../../nest-src/modules/design-patterns/design-patterns.module';
import { DesignPatternsController } from '../../nest-src/modules/design-patterns/design-patterns.controller';
import { DesignPatternsService } from '../../nest-src/modules/design-patterns/design-patterns.service';

describe('DesignPatternsModule', () => {
  let designPatternsController: DesignPatternsController;
  let designPatternsService: DesignPatternsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DesignPatternsModule],
    }).compile();

    designPatternsController = module.get<DesignPatternsController>(DesignPatternsController);
    designPatternsService = module.get<DesignPatternsService>(DesignPatternsService);
  });

  it('应该定义设计模式控制器', () => {
    expect(designPatternsController).toBeDefined();
  });

  it('应该定义设计模式服务', () => {
    expect(designPatternsService).toBeDefined();
  });

  describe('getPatterns', () => {
    it('应该返回设计模式列表', () => {
      const result = designPatternsController.getPatterns();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('useCase');
      expect(result[0]).toHaveProperty('example');
    });
  });

  describe('demonstrateChain', () => {
    it('应该演示链式处理', async () => {
      const dto = { text: 'hello' };
      const result = await designPatternsController.demonstrateChain(dto);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Step1');
      expect(result).toContain('Step2');
      expect(result).toContain('Step3');
    });
  });
});
