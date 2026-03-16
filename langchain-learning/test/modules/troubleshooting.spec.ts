/**
 * 故障排查模块测试 - 第 09 章
 */

import { Test, TestingModule } from '@nestjs/testing';
import { TroubleshootingModule } from '../../nest-src/modules/troubleshooting/troubleshooting.module';
import { TroubleshootingController } from '../../nest-src/modules/troubleshooting/troubleshooting.controller';
import { TroubleshootingService } from '../../nest-src/modules/troubleshooting/troubleshooting.service';

describe('TroubleshootingModule', () => {
  let troubleshootingController: TroubleshootingController;
  let troubleshootingService: TroubleshootingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TroubleshootingModule],
    }).compile();

    troubleshootingController = module.get<TroubleshootingController>(TroubleshootingController);
    troubleshootingService = module.get<TroubleshootingService>(TroubleshootingService);
  });

  it('应该定义故障排查控制器', () => {
    expect(troubleshootingController).toBeDefined();
  });

  it('应该定义故障排查服务', () => {
    expect(troubleshootingService).toBeDefined();
  });

  describe('getCommonIssues', () => {
    it('应该返回常见问题列表', () => {
      const result = troubleshootingController.getCommonIssues();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('problem');
      expect(result[0]).toHaveProperty('cause');
      expect(result[0]).toHaveProperty('solution');
      expect(result[0]).toHaveProperty('prevention');
    });
  });

  describe('getDebugTips', () => {
    it('应该返回调试技巧列表', () => {
      const result = troubleshootingController.getDebugTips();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('category');
      expect(result[0]).toHaveProperty('tips');
      expect(Array.isArray(result[0].tips)).toBe(true);
    });
  });
});
