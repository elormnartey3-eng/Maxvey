-- =======================================================
-- MAXVEY CLOTHING BRAND DATABASE SCHEMA (PostgreSQL / Neon)
-- =======================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline VARCHAR(255),
  description TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]',
  care_instructions JSONB DEFAULT '[]',
  price INTEGER NOT NULL, -- Stored in NGN (kobo or whole naira)
  compare_at_price INTEGER,
  category VARCHAR(100) NOT NULL,
  collection VARCHAR(100),
  images JSONB NOT NULL DEFAULT '[]',
  featured_image VARCHAR(500) NOT NULL,
  sizes JSONB NOT NULL DEFAULT '[]',
  colors JSONB NOT NULL DEFAULT '[]',
  variants JSONB DEFAULT '[]',
  stock INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE NOT NULL,
  customer_full_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_state VARCHAR(100) NOT NULL,
  customer_postal_code VARCHAR(20),
  customer_notes TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, paid, processing, shipped, delivered, cancelled
  payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid', -- unpaid, verified, failed, refunded
  payment_method VARCHAR(30) NOT NULL DEFAULT 'paystack',
  paystack_reference VARCHAR(150),
  paystack_paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  key VARCHAR(50) PRIMARY KEY DEFAULT 'current',
  announcement_text TEXT NOT NULL,
  announcement_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  brand_slogan VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  contact_whatsapp VARCHAR(50) NOT NULL,
  contact_address TEXT NOT NULL,
  delivery_fees JSONB NOT NULL,
  default_delivery_fee INTEGER NOT NULL DEFAULT 3500,
  free_delivery_threshold INTEGER NOT NULL DEFAULT 75000,
  instagram_handle VARCHAR(100),
  twitter_handle VARCHAR(100),
  tiktok_handle VARCHAR(100),
  paystack_public_key VARCHAR(255),
  is_paystack_live BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Administrator Users
CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_reference);
