import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isServerAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartDiscount, setCartDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch cart from server when authenticated
  const fetchCart = useCallback(async () => {
    if (!isServerAuthenticated) {
      // Load from localStorage for guests
      const local = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(local);
      calculateTotals(local);
      return;
    }
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      const data = res.data;
      setCartItems(data.items || []);
      setCartTotal(data.totalPrice || 0);
      setCartDiscount(data.totalDiscountedPrice || 0);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isServerAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const calculateTotals = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discounted = items.reduce((acc, item) => acc + ((item.discountedPrice || item.price) * item.quantity), 0);
    setCartTotal(total);
    setCartDiscount(discounted);
  };

  const addToCart = useCallback(async (product, size, color, quantity = 1) => {
    const item = {
      productId: product.id || product._id,
      name: product.name,
      image: product.images?.[0] || product.image,
      price: product.price,
      discountedPrice: product.discountedPrice || product.price,
      brand: product.brand,
      size,
      color,
      quantity,
    };

    if (isServerAuthenticated) {
      try {
        await cartApi.addToCart(item);
        await fetchCart();
        toast.success('Added to cart');
      } catch (err) {
        const existing = cartItems.findIndex(i => i.productId === item.productId && i.size === size && i.color === color);
        let updated;
        if (existing >= 0) { updated = [...cartItems]; updated[existing].quantity += quantity; }
        else { updated = [...cartItems, item]; }
        setCartItems(updated); calculateTotals(updated); localStorage.setItem('cart', JSON.stringify(updated));
        toast.success('(Offline) Added to cart');
      }
    } else {
      const existing = cartItems.findIndex(
        (i) => i.productId === item.productId && i.size === size && i.color === color
      );
      let updated;
      if (existing >= 0) {
        updated = [...cartItems];
        updated[existing].quantity += quantity;
      } else {
        updated = [...cartItems, item];
      }
      setCartItems(updated);
      calculateTotals(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
      toast.success('Added to cart');
    }
  }, [isServerAuthenticated, cartItems, fetchCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (isServerAuthenticated) {
      try {
        await cartApi.updateCartItem(itemId, { quantity });
        await fetchCart();
      } catch (err) {
        const updated = cartItems.map((item, idx) => idx === itemId ? { ...item, quantity } : item);
        setCartItems(updated); calculateTotals(updated); localStorage.setItem('cart', JSON.stringify(updated));
      }
    } else {
      const updated = cartItems.map((item, idx) =>
        idx === itemId ? { ...item, quantity } : item
      );
      setCartItems(updated);
      calculateTotals(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
    }
  }, [isServerAuthenticated, cartItems, fetchCart]);

  const removeFromCart = useCallback(async (itemId) => {
    if (isServerAuthenticated) {
      try {
        await cartApi.removeFromCart(itemId);
        await fetchCart();
        toast.success('Removed from cart');
      } catch (err) {
        const updated = cartItems.filter((_, idx) => idx !== itemId);
        setCartItems(updated); calculateTotals(updated); localStorage.setItem('cart', JSON.stringify(updated));
        toast.success('(Offline) Removed from cart');
      }
    } else {
      const updated = cartItems.filter((_, idx) => idx !== itemId);
      setCartItems(updated);
      calculateTotals(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
      toast.success('Removed from cart');
    }
  }, [isServerAuthenticated, cartItems, fetchCart]);

  const clearCart = useCallback(async () => {
    if (isServerAuthenticated) {
      try {
        await cartApi.clearCart();
        setCartItems([]);
        setCartTotal(0);
        setCartDiscount(0);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      setCartItems([]);
      setCartTotal(0);
      setCartDiscount(0);
      localStorage.removeItem('cart');
    }
  }, [isServerAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        cartDiscount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
