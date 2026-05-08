import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoTrashOutline, IoBagHandleOutline } from 'react-icons/io5';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'Default', 1);
    toggleWishlist(product);
    toast.success('Moved to cart!');
  };

  if (wishlistItems.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: 80 }}>💝</motion.div>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Save items you love for later</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8 }}>My Wishlist</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: 14 }}>{wishlistItems.length} items saved</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {wishlistItems.map((product, idx) => {
          const pid = product.id || product._id || product.productId;
          const discount = product.discountPercent || (product.price && product.discountedPrice ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0);
          return (
            <motion.div key={pid || idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <div className="card" style={{ overflow: 'hidden' }}>
                <Link to={`/product/${pid}`} style={{ display: 'block', position: 'relative' }}>
                  <div style={{ paddingTop: '130%', background: 'var(--color-surface-hover)', position: 'relative' }}>
                    <img src={product.images?.[0] || product.image || `https://picsum.photos/seed/${idx + 500}/400/520`} alt={product.name}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {discount > 0 && (
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--color-accent)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>{discount}% OFF</span>
                  )}
                </Link>
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{product.brand}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, marginTop: 4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800 }}>{formatPrice(product.discountedPrice || product.price)}</span>
                    {discount > 0 && <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.price)}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => handleMoveToCart(product)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      <IoBagHandleOutline size={16} /> Move to Cart
                    </button>
                    <button onClick={() => toggleWishlist(product)} className="btn btn-secondary btn-sm" style={{ width: 40, padding: 0 }}>
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
