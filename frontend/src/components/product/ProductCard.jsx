import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoStarSharp } from 'react-icons/io5';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product, index = 0 }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const pid = product.id || product._id;
  const wishlisted = isInWishlist(pid);
  const discount = product.discountPercent || (product.price && product.discountedPrice ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ position: 'relative' }}
    >
      <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <Link to={`/product/${pid}`} style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', paddingTop: '130%', background: 'var(--color-surface-hover)' }}>
            <img
              src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x400?text=Product'}
              alt={product.name}
              loading="lazy"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
          </div>
          {discount > 0 && (
            <span style={{ position: 'absolute', top: 12, left: 12, background: 'var(--color-accent)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>
              {discount}% OFF
            </span>
          )}
          {product.trending && (
            <span style={{ position: 'absolute', top: 12, right: 12, background: 'var(--color-primary)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700 }}>
              TRENDING
            </span>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
          style={{
            position: 'absolute', top: discount > 0 && product.trending ? 44 : 12, right: 12,
            width: 36, height: 36, borderRadius: '50%', background: 'var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)', zIndex: 2, transition: 'all var(--transition-fast)',
            color: wishlisted ? '#FF6B6B' : 'var(--color-text-secondary)',
          }}
        >
          {wishlisted ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
        </button>

        {/* Details */}
        <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {product.brand}
          </p>
          <Link to={`/product/${pid}`}>
            <p style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.name}
            </p>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>
              {formatPrice(product.discountedPrice || product.price)}
            </span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 700 }}>
                  ({discount}% off)
                </span>
              </>
            )}
          </div>
          {product.ratings > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--color-success)', color: '#fff', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 700 }}>
                {product.ratings?.toFixed(1)} <IoStarSharp size={10} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
