import { supabase } from '../shared/utils/supabase';

export default async function handler(req, res) {
  const host = req.headers.host;
  const mainDomain = 'mornhub.net';
  const match = host.match(new RegExp(`^(.*?)\.${mainDomain.replace('.', '\.')}$`));
  const productSlug = match ? match[1] : null;

  if (!productSlug) return res.status(400).json({ error: 'No subdomain' });

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('product_slug', productSlug)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) return res.status(500).json({ error });
    res.status(200).json({ data });
  } else if (req.method === 'POST') {
    const { user_id, title, content } = req.body;
    const { data, error } = await supabase
      .from('posts')
      .insert([{ product_slug: productSlug, user_id, title, content }]);
    if (error) return res.status(500).json({ error });
    res.status(200).json({ data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 