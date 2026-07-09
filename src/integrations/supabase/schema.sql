-- ============================================
-- DiTech E-commerce Database Schema
-- PostgreSQL with Row Level Security (RLS)
-- Best Practices: 2025
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(256) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- PRODUCTS & CATALOG
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  currency CHAR(3) DEFAULT 'USD',
  category_id INT,
  sku VARCHAR(100) UNIQUE,
  image_url VARCHAR(512),
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INT DEFAULT 0,
  attributes JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(512) NOT NULL,
  alt_text VARCHAR(256),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_in_stock ON products(in_stock) WHERE in_stock = TRUE;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to active products" ON products
  FOR SELECT USING (is_active = TRUE);

-- ============================================
-- ORDERS & ORDER ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  shipping_address_id UUID,
  billing_address_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own order items" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_id = auth.uid()
    )
  );

-- ============================================
-- SHIPPING ADDRESSES
-- ============================================
CREATE TABLE IF NOT EXISTS shipping_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  street_address VARCHAR(256) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shipping_addresses_customer ON shipping_addresses(customer_id);

ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own addresses" ON shipping_addresses
  FOR ALL USING (auth.uid() = customer_id);

-- ============================================
-- PAYMENTS (PCI-DSS Compliant)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  stripe_payment_intent_id VARCHAR(256) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_intents_order ON payment_intents(order_id);
CREATE INDEX idx_payment_intents_stripe_id ON payment_intents(stripe_payment_intent_id);

ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their payment intents" ON payment_intents
  FOR SELECT USING (auth.uid() = customer_id);

-- ============================================
-- INVENTORY TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id INT REFERENCES products(id) ON DELETE RESTRICT,
  event_type VARCHAR(50),
  quantity_change INT,
  reference_id VARCHAR(256),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_events_product ON inventory_events(product_id);
CREATE INDEX idx_inventory_events_created_at ON inventory_events(created_at);

-- ============================================
-- AUDIT LOGGING (Soft Deletes)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(100),
  entity_id VARCHAR(256),
  action VARCHAR(50),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update order timestamp
CREATE OR REPLACE FUNCTION update_order_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_updated_at_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_updated_at();

-- Auto-update product timestamp
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER product_updated_at_trigger
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

-- Create customer record on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customers (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
