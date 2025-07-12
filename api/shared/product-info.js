import { supabase } from '../shared/utils/supabase';

export default async function handler(req, res) {
  const slug = req.query.slug || req.query.subdomain;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return res.status(404).json({ error: 'Product not found' });
  res.status(200).json(data);
} 