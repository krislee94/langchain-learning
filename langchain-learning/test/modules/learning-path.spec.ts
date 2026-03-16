/**
 * 学习路径模块测试 - 第 10 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LearningPathModule } from '../../nest-src/modules/learning-path/learning-path.module';
import { LearningPathController } from '../../nest-src/modules/learning-path/learning-path.controller';
import { LearningPathService } from '../../nest-src/modules/learning-path/learning-path.service';

describe('LearningPathModule', () => {
  let learningPathController: LearningPathController;
  let learningPathService: LearningPathService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LearningPathModule],
    }).compile();

    learningPathController = module.get<LearningPathController>(LearningPathController);
    learningPathService = module.get<LearningPathService>(LearningPathService);
  });

  it('应该定义学习路径控制器', () => {
    expect(learningPathController).toBeDefined();
  });

  it('应该定义学习路径服务', () => {
    expect(learningPathService).toBeDefined();
  });

  describe('getLearningPath', () => {
    it('应该返回学习路径', () => {
      const result = learningPathController.getLearningPath();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      expect(result[0]).toHaveProperty('level');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('duration');
      expect(result[0]).toHaveProperty('topics');
      expect(result[0]).toHaveProperty('goals');
    });

    it('应该包含初级、中级、高级三个阶段', () => {
      const result = learningPathController.getLearningPath();
      const levels = result.map((r) => r.level);
      expect(levels).toContain('初级');
      expect(levels).toContain('中级');
      expect(levels).toContain('高级');
    });
  });

  describe('getResources', () => {
    it('应该返回学习资源列表', () => {
      const result = learningPathController.getResources();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('type');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('url');
      expect(result[0]).toHaveProperty('description');
    });
  });
});
