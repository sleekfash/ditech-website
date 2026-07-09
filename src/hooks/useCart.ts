import { useState, useCallback } from 'react';
import { Cart, CartItem } from '@/types/checkout';

/**
 * Cart state management hook
 * Handles local state with localStorage persistence
 */
export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    const stored = localStorage.getItem('ditechai_cart');
    return stored ? JSON.parse(stored) : { items: [], total: 0, currency: 'USD' };
  });

  const saveCart = useCallback((newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem('ditechai_cart', JSON.stringify(newCart));
  }, []);

  const addItem = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.product_id === item.product_id);
      const items = existing
        ? prev.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prev.items, item];
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const newCart = { ...prev, items, total };
      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  const removeItem = useCallback((productId: number) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.product_id !== productId);
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const newCart = { ...prev, items, total };
      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCart((prev) => {
      const items =
        quantity <= 0
          ? prev.items.filter((i) => i.product_id !== productId)
          : prev.items.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            );
      const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const newCart = { ...prev, items, total };
      saveCart(newCart);
      return newCart;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    const newCart: Cart = { items: [], total: 0, currency: 'USD' };
    saveCart(newCart);
  }, [saveCart]);

  return { cart, addItem, removeItem, updateQuantity, clearCart };
};
