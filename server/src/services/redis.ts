import Redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis.RedisClientType | null = null;

export async function initializeRedis() {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('✓ Redis connected'));

    await redisClient.connect();
  } catch (error) {
    console.error('✗ Redis connection failed:', error);
    throw error;
  }
}

export function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

export async function setSessionData(
  sessionToken: string,
  data: any,
  ttl: number = 3600
) {
  const client = getRedisClient();
  await client.setEx(
    `session:${sessionToken}`,
    ttl,
    JSON.stringify(data)
  );
}

export async function getSessionData(sessionToken: string) {
  const client = getRedisClient();
  const data = await client.get(`session:${sessionToken}`);
  return data ? JSON.parse(data) : null;
}

export async function deleteSessionData(sessionToken: string) {
  const client = getRedisClient();
  await client.del(`session:${sessionToken}`);
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
  }
}
