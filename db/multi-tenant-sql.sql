-- 多租户 messages 表结构
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null, -- 关联到 products.slug
  user_id uuid,
  content text,
  created_at timestamp default now()
);

-- 多租户 users 表结构
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null, -- 关联到 products.slug
  username text not null,
  email text unique,
  created_at timestamp default now()
);

-- 多租户 orders 表结构
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null, -- 关联到 products.slug
  user_id uuid,
  amount numeric,
  status text,
  created_at timestamp default now()
);

-- 多租户 posts 表结构
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null, -- 关联到 products.slug
  user_id uuid,
  title text,
  content text,
  created_at timestamp default now()
); 