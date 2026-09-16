import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Cart, CartItem } from "@/types/checkout";
import { site } from "@/config/site";

const STORAGE_KEY = "ditech_cart_v2";

const emptyCart = (): Cart => ({ items: [], total: 0, currency: site.commerce.currency });

const readCart = (): Cart => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyCart();
    const parsed = JSON.parse(stored) as Cart;
    if (!Array.isArray(parsed.items)) return emptyCart();
    return { ...emptyCart(), ...parsed };
  } catch {
    return emptyCart();
  }
};

const withTotal = (items: CartItem[]): Cart => ({
  items,
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  currency: site.commerce.currency,
});

type CartContextValue = {
  cart: Cart;
  count: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>(readCart);

  const commit = useCallback((items: CartItem[]) => {
    const next = withTotal(items);
    setCart(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, []);

  const addItem: CartContextValue["addItem"] = useCallback(
    (item) => {
      const qty = item.quantity ?? 1;
      setCart((prev) => {
        const existing = prev.items.find((i) => i.product_id === item.product_id);
        const items = existing
          ? prev.items.map((i) =>
              i.product_id === item.product_id ? { ...i, quantity: i.quantity + qty } : i
            )
          : [...prev.items, { ...item, quantity: qty }];
        const next = withTotal(items);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) => commit(cart.items.filter((i) => i.product_id !== productId)),
    [cart.items, commit]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      commit(
        quantity <= 0
          ? cart.items.filter((i) => i.product_id !== productId)
          : cart.items.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
      ),
    [cart.items, commit]
  );

  const clearCart = useCallback(() => commit([]), [commit]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cart.items.reduce((n, i) => n + i.quantity, 0),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [cart, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};
