import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { ...product, qty }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [cartItems, isCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
