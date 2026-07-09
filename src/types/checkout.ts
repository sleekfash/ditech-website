/**
 * Checkout & E-commerce Type Definitions
 * Based on 2025 best practices for e-commerce database schema
 */

export type CartItem = {
  id: string;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Cart = {
  items: CartItem[];
  total: number;
  currency: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
};

export type Customer = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
};

export type ShippingAddress = {
  id: string;
  customer_id: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
};

export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

export type CheckoutState = {
  step: CheckoutStep;
  cart: Cart;
  customer: Partial<Customer>;
  shippingAddress?: ShippingAddress;
  paymentMethod?: 'stripe' | 'paypal' | 'card';
};

export type PaymentIntent = {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
};
