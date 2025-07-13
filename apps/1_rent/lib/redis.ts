// Mock Redis client for development
// In production, use actual Redis connection
export class MockRedis {
  private store = new Map()

  async set(key: string, value: string, options?: { ex?: number }) {
    this.store.set(key, value)
    if (options?.ex) {
      setTimeout(() => this.store.delete(key), options.ex * 1000)
    }
  }

  async get(key: string) {
    return this.store.get(key) || null
  }

  async del(key: string) {
    return this.store.delete(key)
  }

  async publish(channel: string, message: string) {
    // Mock publish for development
    console.log(`Published to ${channel}: ${message}`)
  }
}

export const redis = new MockRedis()
