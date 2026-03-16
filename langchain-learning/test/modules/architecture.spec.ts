/**
 * 架构模块测试 - 第 02 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ArchitectureModule } from '../../nest-src/modules/architecture/architecture.module';
import { ArchitectureController } from '../../nest-src/modules/architecture/architecture.controller';
import { ArchitectureService } from '../../nest-src/modules/architecture/architecture.service';

describe('ArchitectureModule', () => {
  let architectureController: ArchitectureController;
  let architectureService: ArchitectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ArchitectureModule],
    }).compile();

    architectureController = module.get<ArchitectureController>(ArchitectureController);
    architectureService = module.get<ArchitectureService>(ArchitectureService);
  });

  it('应该定义架构控制器', () => {
    expect(architectureController).toBeDefined();
  });

  it('应该定义架构服务', () => {
    expect(architectureService).toBeDefined();
  });

  describe('getMessageFlow', () => {
    it('应该返回消息流信息', () => {
      const result = architectureController.getMessageFlow();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('types');
      expect(result).toHaveProperty('flow');
      expect(Array.isArray(result.types)).toBe(true);
      expect(Array.isArray(result.flow)).toBe(true);
    });
  });

  describe('createPromptTemplate', () => {
    it('应该创建并格式化提示词模板', async () => {
      const dto = {
        role: '数学老师',
        style: '耐心',
        question: '什么是微积分？',
      };
      const result = await architectureController.createPromptTemplate(dto);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getTools', () => {
    it('应该返回工具定义列表', () => {
      const result = architectureController.getTools();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('description');
    });
  });

  describe('executeTool', () => {
    it('应该执行加法工具', async () => {
      const dto = {
        toolName: 'add',
        params: { a: 3, b: 5 },
      };
      const result = await architectureController.executeTool(dto);
      expect(result).toBe(8);
    });

    it('应该执行乘法工具', async () => {
      const dto = {
        toolName: 'multiply',
        params: { a: 4, b: 7 },
      };
      const result = await architectureController.executeTool(dto);
      expect(result).toBe(28);
    });

    it('执行不存在的工具应该抛出错误', async () => {
      const dto = {
        toolName: 'nonexistent',
        params: {},
      };
      await expect(architectureController.executeTool(dto)).rejects.toThrow();
    });
  });
});
