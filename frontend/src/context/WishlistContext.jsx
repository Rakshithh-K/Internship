import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isServerAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const wishlistCount = wishlistItems.length;

  const fetchWishlist = useCallback(async () => {
    if (!isServerAuthenticated) {
      const local = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(local);
      return;
    }
    setLoading(true);
    try {
      const res = await wishlistApi.getWishlist();
      setWishlistItems(res.data.productIds || res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isServerAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some(
        (item) => (item.id || item._id || item.productId || item) === productId
      );
    },
    [wishlistItems]
  );

  const toggleWishlist = useCallback(async (product) => {
    const productId = product.id || product._id;
    const isWishlisted = isInWishlist(productId);

    if (isServerAuthenticated) {
      try {
        if (isWishlisted) {
          await wishlistApi.removeFromWishlist(productId);
          toast.success('Removed from wishlist');
        } else {
          await wishlistApi.addToWishlist(productId);
          toast.success('Added to wishlist');
        }
        await fetchWishlist();
      } catch (err) {
        let updated;
        if (isWishlisted) {
          updated = wishlistItems.filter((item) => (item.id || item._id || item.productId || item) !== productId);
          toast.success('(Offline) Removed from wishlist');
        } else {
          updated = [...wishlistItems, product];
          toast.success('(Offline) Added to wishlist');
        }
        setWishlistItems(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
      }
    } else {
      let updated;
      if (isWishlisted) {
        updated = wishlistItems.filter(
          (item) => (item.id || item._id || item.productId || item) !== productId
        );
        toast.success('Removed from wishlist');
      } else {
        updated = [...wishlistItems, product];
        toast.success('Added to wishlist');
      }
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    }
  }, [isServerAuthenticated, wishlistItems, isInWishlist, fetchWishlist]);

  const moveToCart = useCallback(async (productId) => {
    if (isServerAuthenticated) {
      try {
        await wishlistApi.moveToCart(productId);
        await fetchWishlist();
        toast.success('Moved to cart');
      } catch (err) {
        // Fallback to offline cart and wishlist
        const productToMove = wishlistItems.find(item => (item.id || item._id || item.productId || item) === productId);
        if (productToMove) {
          const updatedWishlist = wishlistItems.filter(item => (item.id || item._id || item.productId || item) !== productId);
          setWishlistItems(updatedWishlist);
          localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
          toast.success('(Offline) Please add to cart manually or view in local mode');
        }
      }
    }
  }, [isServerAuthenticated, wishlistItems, fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        isInWishlist,
        toggleWishlist,
        moveToCart,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
