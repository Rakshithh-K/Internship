import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoHeartOutline, IoHeart, IoStarSharp, IoBagHandleOutline, IoShareSocialOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/formatPrice';
import { SIZES, COLORS, BRANDS, CATEGORIES } from '../utils/constants';
import { DEMO_PRODUCTS } from '../utils/demoData';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProductById(id);
        setProduct(res.data);
        // Fetch reviews
        try {
          const revRes = await productApi.getReviews(id);
          setReviews(revRes.data || []);
        } catch {}
        // Fetch related products
        try {
          const relRes = await productApi.getProducts({ category: res.data.category, limit: 5 });
          setRelatedProducts((relRes.data?.content || relRes.data || []).filter(p => (p.id || p._id) !== id));
        } catch {}
      } catch {
        // Use demo data if API fails
        const demoProduct = DEMO_PRODUCTS.find(p => p.id === id) || DEMO_PRODUCTS[0];
        setProduct(demoProduct);
        setRelatedProducts(DEMO_PRODUCTS.filter(p => p.category === demoProduct.category && p.id !== id).slice(0, 4));
        setReviews([
          { id: '1', userId: 'u1', userName: 'Rahul S.', rating: 5, comment: 'Excellent quality! The fabric is really soft and the fit is perfect. Highly recommended.', createdAt: '2026-04-15' },
          { id: '2', userId: 'u2', userName: 'Priya M.', rating: 4, comment: 'Good shirt for the price. Color is exactly as shown. Slight delay in delivery though.', createdAt: '2026-04-10' },
          { id: '3', userId: 'u3', userName: 'Arjun K.', rating: 5, comment: 'Best shirt I have bought online. Will definitely order more!', createdAt: '2026-04-05' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader size="lg" text="Loading product..." />;
  if (!product) return <div className="container-main" style={{ textAlign: 'center', padding: 80 }}><h2>Product not found</h2></div>;

  const wishlisted = isInWishlist(product.id || product._id);
  const discount = product.discountPercent || Math.round(((product.price - product.discountedPrice) / product.price) * 100);

  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    addToCart(product, selectedSize, selectedColor || product.colors?.[0] || 'Default', quantity);
  };

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
        <Link to="/" style={{ color: 'var(--color-text-secondary)' }}>Home</Link> /
        <Link to="/products" style={{ color: 'var(--color-text-secondary)' }}>Products</Link> /
        <span>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Image Gallery */}
        <div>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--color-surface-hover)' }}>
            <motion.img key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600x780'}
              alt={product.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setSelectedImage(i => i > 0 ? i - 1 : product.images.length - 1)}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoChevronBackOutline size={18} />
                </button>
                <button onClick={() => setSelectedImage(i => i < product.images.length - 1 ? i + 1 : 0)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'var(--color-surface)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoChevronForwardOutline size={18} />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  style={{ width: 72, height: 90, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: selectedImage === i ? '2px solid var(--color-primary)' : '2px solid var(--color-border)', opacity: selectedImage === i ? 1 : 0.6, cursor: 'pointer' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{product.brand}</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 }}>{product.name}</h1>
          {product.ratings > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-success)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 700 }}>
                {product.ratings?.toFixed(1)} <IoStarSharp size={12} />
              </div>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>{product.reviewCount} reviews</span>
            </div>
          )}

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 800 }}>{formatPrice(product.discountedPrice || product.price)}</span>
            {discount > 0 && (
              <>
                <span style={{ fontSize: 20, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(product.price)}</span>
                <span className="badge badge-accent" style={{ fontSize: 14 }}>{discount}% OFF</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--color-success)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>Inclusive of all taxes</p>

          {/* Size Selection */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Select Size</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(product.sizes || SIZES).map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: 14,
                    background: selectedSize === size ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: selectedSize === size ? '#fff' : 'var(--color-text)',
                    border: `2px solid ${selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    transition: 'all var(--transition-fast)',
                  }}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          {(product.colors?.length > 0) && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Select Color: <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>{selectedColor}</span></p>
              <div style={{ display: 'flex', gap: 8 }}>
                {product.colors.map(color => {
                  const hex = COLORS.find(c => c.name === color)?.hex || '#888';
                  return (
                    <button key={color} onClick={() => setSelectedColor(color)} title={color}
                      style={{ width: 36, height: 36, borderRadius: '50%', background: hex, border: selectedColor === color ? '3px solid var(--color-primary)' : '2px solid var(--color-border)', cursor: 'pointer', boxShadow: selectedColor === color ? '0 0 0 2px var(--color-bg)' : 'none' }} />
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: 'var(--color-surface-hover)', fontWeight: 700, fontSize: 18 }}>−</button>
              <span style={{ width: 48, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(10, q + 1))} style={{ width: 40, height: 40, background: 'var(--color-surface-hover)', fontWeight: 700, fontSize: 18 }}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
              <IoBagHandleOutline size={20} /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product)} className="btn btn-secondary btn-lg" style={{ width: 56 }}>
              {wishlisted ? <IoHeart size={22} color="#FF6B6B" /> : <IoHeartOutline size={22} />}
            </button>
          </div>

          {/* Stock info */}
          <p style={{ fontSize: 13, color: product.stock > 10 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 60 }}>
        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-border)', gap: 4 }}>
          {['description', 'reviews'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 24px', fontSize: 14, fontWeight: 700, textTransform: 'capitalize',
                borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: 'none', marginBottom: -2,
              }}>
              {tab} {tab === 'reviews' && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div style={{ paddingTop: 24 }}>
          {activeTab === 'description' && (
            <div style={{ maxWidth: 700, lineHeight: 1.8, color: 'var(--color-text-secondary)', whiteSpace: 'pre-line', fontSize: 15 }}>
              {product.description || 'No description available.'}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div style={{ maxWidth: 700 }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', padding: '20px 0' }}>No reviews yet. Be the first to review!</p>
              ) : reviews.map(review => (
                <div key={review.id} style={{ padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {review.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{review.userName || 'Anonymous'}</p>
                      <div style={{ display: 'flex', gap: 2 }}>{Array.from({ length: 5 }, (_, i) => <IoStarSharp key={i} size={12} color={i < review.rating ? '#FDCB6E' : 'var(--color-border)'} />)}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--color-text-muted)' }}>{review.createdAt}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 60 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 24 }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {relatedProducts.slice(0, 4).map((p, i) => <ProductCard key={p.id || i} product={p} index={i} />)}
          </div>
        </div>
      )}

      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 24px !important; } }`}</style>
    </div>
  );
};

export default ProductDetail;
