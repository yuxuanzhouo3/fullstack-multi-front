export default async function handler(req, res) {
  // TODO: 实现多租户payment逻辑
  res.status(200).json({ msg: 'payment endpoint (multi-tenant ready)' });
} 