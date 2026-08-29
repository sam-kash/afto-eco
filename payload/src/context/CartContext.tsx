'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  showCart: boolean;
  setShowCart: (v: boolean) => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smh_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persist on change only AFTER hydration completes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('smh_cart', JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (product: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, showCart, setShowCart, addToCart, removeFromCart, updateQuantity, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}
