/**
 * 健康检查模块测试
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from '../../nest-src/modules/health/health.module';
import { HealthController } from '../../nest-src/modules/health/health.controller';
import { HealthService } from '../../nest-src/modules/health/health.service';

describe('HealthModule', () => {
  let healthController: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  it('应该定义健康检查控制器', () => {
    expect(healthController).toBeDefined();
  });

  it('应该定义健康检查服务', () => {
    expect(healthService).toBeDefined();
  });

  describe('getHealth', () => {
    it('应该返回健康状态', () => {
      const result = healthController.getHealth();
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeGreaterThan(0);
      expect(result.version).toBe('1.0.0');
    });
  });
});
