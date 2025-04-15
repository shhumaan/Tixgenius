import { Redis } from 'ioredis';
import { env } from '../../config/environment';

// Redis client options
const redisOptions = {
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
  keepAlive: 30000, // Keep alive every 30 seconds
  connectTimeout: 10000, // Connection timeout after 10 seconds
  disconnectTimeout: 2000, // Disconnection timeout after 2 seconds
};

// Create the Redis client
export const redis = new Redis(env.REDIS_URL, redisOptions);

// Setup event handlers
redis.on('connect', () => {
  console.log('Redis client connected');
});

redis.on('error', (err) => {
  console.error('Redis client error:', err);
});

redis.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});

// Cache helpers
export const cacheKeys = {
  user: (id: string) => `user:${id}`,
  ticket: (id: string) => `ticket:${id}`,
  tickets: (categoryId?: string) => categoryId ? `tickets:category:${categoryId}` : 'tickets:all',
  categories: () => 'categories:all',
};

/**
 * Set a cache entry with expiration
 */
export const setCache = async (key: string, data: any, ttl = env.REDIS_CACHE_TTL): Promise<void> => {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
};

/**
 * Get a cache entry
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get(key);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.error('Failed to parse cached data', err);
    return null;
  }
};

/**
 * Delete a cache entry or entries matching a pattern
 */
export const deleteCache = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

/**
 * Clean all cache (use cautiously)
 */
export const flushCache = async (): Promise<void> => {
  await redis.flushdb();
};

/**
 * Health check
 */
export const redisHealthCheck = async (): Promise<boolean> => {
  try {
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (err) {
    console.error('Redis health check failed', err);
    return false;
  }
}; 