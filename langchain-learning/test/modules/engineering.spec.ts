/**
 * 工程化模块测试 - 第 08 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EngineeringModule } from '../../nest-src/modules/engineering/engineering.module';
import { EngineeringController } from '../../nest-src/modules/engineering/engineering.controller';
import { EngineeringService } from '../../nest-src/modules/engineering/engineering.service';

describe('EngineeringModule', () => {
  let engineeringController: EngineeringController;
  let engineeringService: EngineeringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EngineeringModule],
    }).compile();

    engineeringController = module.get<EngineeringController>(EngineeringController);
    engineeringService = module.get<EngineeringService>(EngineeringService);
  });

  it('应该定义工程化控制器', () => {
    expect(engineeringController).toBeDefined();
  });

  it('应该定义工程化服务', () => {
    expect(engineeringService).toBeDefined();
  });

  describe('getPractices', () => {
    it('应该返回工程化实践列表', () => {
      const result = engineeringController.getPractices();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('category');
      expect(result[0]).toHaveProperty('practices');
      expect(Array.isArray(result[0].practices)).toBe(true);
    });
  });

  describe('getProjectStructure', () => {
    it('应该返回项目结构说明', () => {
      const result = engineeringController.getProjectStructure();
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('nest-src');
      expect(result).toContain('modules');
    });
  });
});
