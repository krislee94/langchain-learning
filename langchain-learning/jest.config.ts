import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          isolatedModules: false,
        },
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },
  collectCoverageFrom: ['nest-src/**/*.(t|j)s'],
  coverageDirectory: './coverage-nest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/nest-src/$1',
    '^@modules/(.*)$': '<rootDir>/nest-src/modules/$1',
    '^@services/(.*)$': '<rootDir>/nest-src/services/$1',
    '^@common/(.*)$': '<rootDir>/nest-src/common/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts'],
};

export default config;
