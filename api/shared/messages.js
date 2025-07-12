import { supabase } from '../shared/utils/supabase';

export default async function handler(req, res) {
  // 自动识别 subdomain
  const host = req.headers.host;
  const mainDomain = 'mornhub.net';
  const match = host.match(new RegExp(`^(.*?)\.${mainDomain.replace('.', '\.')}$`));
  const productSlug = match ? match[1] : null;

  if (!productSlug) return res.status(400).json({ error: 'No subdomain' });

  if (req.method === 'GET') {
    // 查询该产品的所有消息
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('product_slug', productSlug)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error });
    res.status(200).json({ data });
  } else if (req.method === 'POST') {
    // 新增消息
    const { user_id, content } = req.body;
    const { data, error } = await supabase
      .from('messages')
      .insert([{ product_slug: productSlug, user_id, content }]);
    if (error) return res.status(500).json({ error });
    res.status(200).json({ data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 