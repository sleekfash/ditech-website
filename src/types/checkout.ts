/**
 * Checkout & e-commerce types.
 * Product ids are the catalogue UUIDs stored in the database.
 */

export type CartItem = {
  product_id: string;
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

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes: string | null;
  currency: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

export type CheckoutStep = "cart" | "details" | "confirmation";
