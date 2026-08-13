-- KADHA SAREES SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/oglbbffvqyqrlctkycfs/sql/new)

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  weave TEXT NOT NULL,
  colour TEXT NOT NULL,
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_stock',
  stock_qty INT DEFAULT 1,
  image TEXT NOT NULL,
  views JSONB DEFAULT '[]'::jsonb,
  blurb TEXT,
  fabric TEXT,
  blouse TEXT,
  care TEXT,
  cart_adds_count INT DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Notify Requests Table
CREATE TABLE IF NOT EXISTS public.notify_requests (
  id TEXT PRIMARY KEY,
  saree_name TEXT NOT NULL,
  saree_slug TEXT NOT NULL,
  phone TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'Pending'
);

-- Enable public access for frontend demo storefront
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notify_requests DISABLE ROW LEVEL SECURITY;
