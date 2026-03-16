/**
 * LangGraph 模块测试 - 第 07 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LanggraphModule } from '../../nest-src/modules/langgraph/langgraph.module';
import { LanggraphController } from '../../nest-src/modules/langgraph/langgraph.controller';
import { LanggraphService } from '../../nest-src/modules/langgraph/langgraph.service';

describe('LanggraphModule', () => {
  let langgraphController: LanggraphController;
  let langgraphService: LanggraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LanggraphModule],
    }).compile();

    langgraphController = module.get<LanggraphController>(LanggraphController);
    langgraphService = module.get<LanggraphService>(LanggraphService);
  });

  it('应该定义 LangGraph 控制器', () => {
    expect(langgraphController).toBeDefined();
  });

  it('应该定义 LangGraph 服务', () => {
    expect(langgraphService).toBeDefined();
  });

  describe('getBasicGraph', () => {
    it('应该返回基础状态图定义', () => {
      const result = langgraphController.getBasicGraph();
      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(Array.isArray(result.nodes)).toBe(true);
      expect(Array.isArray(result.edges)).toBe(true);
    });
  });

  describe('getDeepAgentsGraph', () => {
    it('应该返回 Deep Agents 图定义', () => {
      const result = langgraphController.getDeepAgentsGraph();
      expect(result).toBeDefined();
      expect(result.name).toBe('Deep Agents 协作图');
      expect(result.nodes.length).toBeGreaterThan(0);
    });
  });

  describe('execute', () => {
    it('应该模拟图执行流程', async () => {
      const dto = { input: '写一篇关于 AI 的文章' };
      const result = await langgraphController.execute(dto);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Orchestrator');
      expect(result).toContain('Researcher');
      expect(result).toContain('Writer');
    });
  });
});
