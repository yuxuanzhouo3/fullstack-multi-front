import type { NextApiRequest, NextApiResponse } from 'next';
import postsHandler from '../../../../../shared/api/posts';
import usersHandler from '../../../../../shared/api/users';
import messagesHandler from '../../../../../shared/api/messages';
import ordersHandler from '../../../../../shared/api/orders';
import authHandler from '../../../../../shared/api/auth';
import paymentHandler from '../../../../../shared/api/payment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path = [] } = req.query;
  const fullPath = Array.isArray(path) ? path.join('/') : path;

  // Health endpoint
  if (fullPath === 'health') {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
    return;
  }

  // Route to shared/api handlers
  if (fullPath.startsWith('posts')) {
    return postsHandler(req, res);
  }
  if (fullPath.startsWith('users')) {
    return usersHandler(req, res);
  }
  if (fullPath.startsWith('messages')) {
    return messagesHandler(req, res);
  }
  if (fullPath.startsWith('orders')) {
    return ordersHandler(req, res);
  }
  if (fullPath.startsWith('auth')) {
    return authHandler(req, res);
  }
  if (fullPath.startsWith('payment')) {
    return paymentHandler(req, res);
  }

  res.status(404).json({ error: 'API endpoint not found', path: fullPath });
} 