import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  try {
    // Set a test key
    await redis.set('test-key', 'Hello from Redis!');
    // Get the test key
    const value = await redis.get('test-key');
    res.status(200).json({ success: true, value });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
} 