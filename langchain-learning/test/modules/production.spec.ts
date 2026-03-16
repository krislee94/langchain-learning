/**
 * 生产场景模块测试 - 第 06 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductionModule } from '../../nest-src/modules/production/production.module';
import { ProductionController } from '../../nest-src/modules/production/production.controller';
import { ProductionService } from '../../nest-src/modules/production/production.service';

describe('ProductionModule', () => {
  let productionController: ProductionController;
  let productionService: ProductionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductionModule],
    }).compile();

    productionController = module.get<ProductionController>(ProductionController);
    productionService = module.get<ProductionService>(ProductionService);
  });

  it('应该定义生产场景控制器', () => {
    expect(productionController).toBeDefined();
  });

  it('应该定义生产场景服务', () => {
    expect(productionService).toBeDefined();
  });

  describe('getScenarios', () => {
    it('应该返回生产场景列表', () => {
      const result = productionController.getScenarios();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('challenges');
      expect(result[0]).toHaveProperty('solution');
    });
  });

  describe('simulateRAG', () => {
    it('应该模拟 RAG 流程', async () => {
      const dto = { query: '什么是 LangChain？' };
      const result = await productionController.simulateRAG(dto);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('检索');
      expect(result).toContain('LLM');
    });
  });
});
