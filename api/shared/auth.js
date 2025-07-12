export default async function handler(req, res) {
  // TODO: 实现多租户auth逻辑（注册/登录/三方登录/2FA等）
  res.status(200).json({ msg: 'auth endpoint (multi-tenant ready)' });
} 