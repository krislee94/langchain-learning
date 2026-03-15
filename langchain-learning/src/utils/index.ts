/**
 * 工具函数索引
 */

export * from './logger.js';

/**
 * 睡眠函数（用于演示或重试）
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoff = 2 } = options;

  let lastError: unknown;
  let currentDelay = delayMs;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await sleep(currentDelay);
        currentDelay *= backoff;
      }
    }
  }

  throw lastError;
}

/**
 * 格式化时间
 */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
