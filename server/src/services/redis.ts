import Redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis.RedisClientType | null = null;
let useInMemoryFallback = false;

// In-memory fallback for when Redis is not available (PoC/demo mode)
const inMemoryStore = new Map<string, { data: string; expiresAt: number }>();

export async function initializeRedis() {
  // Skip Redis if explicitly disabled or no URL provided
  if (process.env.DISABLE_REDIS === 'true') {
    console.log('⚠ Redis disabled - using in-memory session storage');
    useInMemoryFallback = true;
    return;
  }

  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err.message);
      // Don't crash, fall back to in-memory
      if (!useInMemoryFallback) {
        console.log('⚠ Falling back to in-memory session storage');
        useInMemoryFallback = true;
      }
    });

    redisClient.on('connect', () => console.log('✓ Redis connected'));

    await redisClient.connect();
  } catch (error) {
    console.warn('⚠ Redis connection failed - using in-memory session storage');
    useInMemoryFallback = true;
  }
}

export function getRedisClient() {
  return redisClient;
}

export async function setSessionData(
  sessionToken: string,
  data: any,
  ttl: number = 3600
) {
  const key = `session:${sessionToken}`;
  const jsonData = JSON.stringify(data);

  if (useInMemoryFallback || !redisClient?.isOpen) {
    // Use in-memory fallback
    inMemoryStore.set(key, {
      data: jsonData,
      expiresAt: Date.now() + ttl * 1000,
    });
    return;
  }

  try {
    await redisClient.setEx(key, ttl, jsonData);
  } catch (error) {
    // Fall back to in-memory on error
    inMemoryStore.set(key, {
      data: jsonData,
      expiresAt: Date.now() + ttl * 1000,
    });
  }
}

export async function getSessionData(sessionToken: string) {
  const key = `session:${sessionToken}`;

  if (useInMemoryFallback || !redisClient?.isOpen) {
    // Use in-memory fallback
    const entry = inMemoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      inMemoryStore.delete(key);
      return null;
    }
    return JSON.parse(entry.data);
  }

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    // Fall back to in-memory on error
    const entry = inMemoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      inMemoryStore.delete(key);
      return null;
    }
    return JSON.parse(entry.data);
  }
}

export async function deleteSessionData(sessionToken: string) {
  const key = `session:${sessionToken}`;

  if (useInMemoryFallback || !redisClient?.isOpen) {
    inMemoryStore.delete(key);
    return;
  }

  try {
    await redisClient.del(key);
  } catch (error) {
    inMemoryStore.delete(key);
  }
}

export async function closeRedis() {
  if (redisClient?.isOpen) {
    await redisClient.quit();
  }
}
