import { redis } from '../shared/utils/redis';

export default async function handler(req, res) {
  await redis.set("foo", "bar");
  const value = await redis.get("foo");
  res.status(200).json({ value });
} 