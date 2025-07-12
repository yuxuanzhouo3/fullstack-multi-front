export default async function handler(req, res) {
  // TODO: 实现多租户AI/LLM/GPT逻辑
  res.status(200).json({ msg: 'ai endpoint (multi-tenant ready)' });
} 