import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://firm-minnow-40919.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AZ_XAAIjcDEwOWFkMDEwOTFjMTE0YTdjYWY5MTE3OWNlNGQ0MWQxNHAxMA',
}); 