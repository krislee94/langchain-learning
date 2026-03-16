/**
 * 组件模块测试 - 第 04 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsModule } from '../../nest-src/modules/components/components.module';
import { ComponentsController } from '../../nest-src/modules/components/components.controller';
import { ComponentsService } from '../../nest-src/modules/components/components.service';

describe('ComponentsModule', () => {
  let componentsController: ComponentsController;
  let componentsService: ComponentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ComponentsModule],
    }).compile();

    componentsController = module.get<ComponentsController>(ComponentsController);
    componentsService = module.get<ComponentsService>(ComponentsService);
  });

  it('应该定义组件控制器', () => {
    expect(componentsController).toBeDefined();
  });

  it('应该定义组件服务', () => {
    expect(componentsService).toBeDefined();
  });

  describe('getComponents', () => {
    it('应该返回六大核心组件信息', () => {
      const result = componentsController.getComponents();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(6);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('example');
    });
  });

  describe('demonstratePrompt', () => {
    it('应该演示提示词模板', async () => {
      const result = await componentsController.demonstratePrompt();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('翻译');
    });
  });

  describe('demonstrateChain', () => {
    it('在没有 API Key 时应该抛出错误', async () => {
      const dto = { text: '测试文本' };
      await expect(componentsController.demonstrateChain(dto)).rejects.toThrow();
    });
  });

  describe('createTool', () => {
    it('应该创建演示工具', () => {
      const result = componentsController.createTool();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
    });
  });
});
