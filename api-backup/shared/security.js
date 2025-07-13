export default async function handler(req, res) {
  // TODO: 实现多租户security逻辑
  res.status(200).json({ msg: 'security endpoint (multi-tenant ready)' });
} 