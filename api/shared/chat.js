export default async function handler(req, res) {
  // TODO: 实现多租户chat逻辑
  res.status(200).json({ msg: 'chat endpoint (multi-tenant ready)' });
} 