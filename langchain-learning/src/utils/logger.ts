/**
 * 日志工具
 *
 * 使用 pino 提供结构化日志
 */

import pino from 'pino';

/**
 * 创建日志实例
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * 日志上下文接口
 */
export interface LogContext {
  module?: string;
  function?: string;
  [key: string]: unknown;
}

/**
 * 调试日志
 */
export function debug(message: string, context?: LogContext): void {
  logger.debug(context ? { ...context } : {}, message);
}

/**
 * 信息日志
 */
export function info(message: string, context?: LogContext): void {
  logger.info(context ? { ...context } : {}, message);
}

/**
 * 警告日志
 */
export function warn(message: string, context?: LogContext): void {
  logger.warn(context ? { ...context } : {}, message);
}

/**
 * 错误日志
 */
export function error(message: string, context?: LogContext): void {
  logger.error(context ? { ...context } : {}, message);
}

/**
 * 带错误对象的错误日志
 */
export function errorWithException(message: string, error: unknown, context?: LogContext): void {
  const errorContext = {
    ...context,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
  logger.error(errorContext, message);
}
