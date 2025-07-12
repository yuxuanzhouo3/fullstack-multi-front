-- 多租户 messages 表结构
create table messages (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null, -- 关联到 products.slug
  user_id uuid,
  content text,
  created_at timestamp default now()
); 