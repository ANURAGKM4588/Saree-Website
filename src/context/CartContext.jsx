import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

function getUserStorageKey(key) {
  try {
    const userStr = localStorage.getItem('kadha_customer_user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      if (parsed && parsed.email) {
        return `kadha_${key}_${parsed.email.toLowerCase().trim()}`;
      }
    }
  } catch (e) {
    console.error('Error getting user key:', e);
  }
  return `kadha_${key}_guest`;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = getUserStorageKey('cart');
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [wishlist, setWishlist] = useState(() => {
    try {
      const key = getUserStorageKey('wishlist');
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync state to localStorage whenever cartItems or wishlist changes
  useEffect(() => {
    try {
      const key = getUserStorageKey('cart');
      localStorage.setItem(key, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      const key = getUserStorageKey('wishlist');
      localStorage.setItem(key, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  // Sync state when user logs in or switches account
  useEffect(() => {
    const handleStorageOrLogin = () => {
      try {
        const cartKey = getUserStorageKey('cart');
        const savedCart = localStorage.getItem(cartKey);
        setCartItems(savedCart ? JSON.parse(savedCart) : []);

        const wishKey = getUserStorageKey('wishlist');
        const savedWish = localStorage.getItem(wishKey);
        setWishlist(savedWish ? JSON.parse(savedWish) : []);
      } catch (e) {
        console.error('Error syncing user storage:', e);
      }
    };

    window.addEventListener('storage', handleStorageOrLogin);
    window.addEventListener('kadha_user_changed', handleStorageOrLogin);
    return () => {
      window.removeEventListener('storage', handleStorageOrLogin);
      window.removeEventListener('kadha_user_changed', handleStorageOrLogin);
    };
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isCartOpen]);

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

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems]
  );

  const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

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
      wishlist,
      toggleWishlist,
      wishlistCount,
    }),
    [cartItems, isCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, wishlist, toggleWishlist, wishlistCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
