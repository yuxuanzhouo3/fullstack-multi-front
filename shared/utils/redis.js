export const redisGet = async (key) => {
  const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  return (await res.json()).result;
};

export const redisSet = async (key, value) => {
  await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/set/${key}/${value}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
}; 