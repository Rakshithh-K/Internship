import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline, IoBagHandleOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { useState } from 'react';
import { DEMO_COUPONS } from '../utils/constants';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, cartTotal, cartDiscount, cartCount, updateQuantity, removeFromCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountTotal = cartItems.reduce((acc, item) => acc + ((item.price - (item.discountedPrice || item.price)) * item.quantity), 0);
  const deliveryFee = subtotal > 999 ? 0 : 99;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') couponDiscount = Math.round((subtotal - discountTotal) * appliedCoupon.discount / 100);
    else couponDiscount = appliedCoupon.discount;
  }
  const total = subtotal - discountTotal - couponDiscount + deliveryFee;

  const applyCoupon = () => {
    const coupon = DEMO_COUPONS[couponCode.toUpperCase()];
    if (!coupon) { toast.error('Invalid coupon code'); return; }
    if ((subtotal - discountTotal) < coupon.minOrder) { toast.error(`Minimum order of ₹${coupon.minOrder} required`); return; }
    setAppliedCoupon(coupon);
    toast.success(`Coupon applied! ${coupon.description}`);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: 80 }}>🛒</motion.div>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Your cart is empty</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Looks like you haven't added anything yet</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Shopping Cart</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: 14 }}>{cartCount} items in your cart</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cartItems.map((item, idx) => (
            <motion.div key={`${item.productId}-${item.size}-${idx}`} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="card" style={{ display: 'flex', gap: 16, padding: 16 }}>
              <Link to={`/product/${item.productId}`}>
                <img src={item.image || `https://picsum.photos/seed/${idx + 400}/120/150`} alt={item.name}
                  style={{ width: 110, height: 140, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)' }} />
              </Link>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{item.brand}</p>
                <Link to={`/product/${item.productId}`}><p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{item.name}</p></Link>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {item.size && <span>Size: <strong>{item.size}</strong></span>}
                  {item.color && <span>Color: <strong>{item.color}</strong></span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{formatPrice(item.discountedPrice || item.price)}</span>
                  {item.discountedPrice && item.discountedPrice < item.price && (
                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{formatPrice(item.price)}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <button onClick={() => removeFromCart(idx)} style={{ background: 'none', color: 'var(--color-text-muted)', padding: 4 }}><IoTrashOutline size={20} /></button>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                  <button onClick={() => updateQuantity(idx, Math.max(1, item.quantity - 1))} style={{ width: 32, height: 32, background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoRemoveOutline size={16} /></button>
                  <span style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: 14 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(idx, Math.min(10, item.quantity + 1))} style={{ width: 32, height: 32, background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IoAddOutline size={16} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ alignSelf: 'flex-start', position: 'sticky', top: 84 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal ({cartCount} items)</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-success)' }}>Discount</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>−{formatPrice(discountTotal)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-primary)' }}>Coupon ({couponCode.toUpperCase()})</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Delivery</span>
                <span style={{ fontWeight: 600, color: deliveryFee === 0 ? 'var(--color-success)' : undefined }}>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
                <span style={{ fontWeight: 800 }}>Total</span>
                <span style={{ fontWeight: 800 }}>{formatPrice(total)}</span>
              </div>
              {discountTotal > 0 && (
                <p style={{ fontSize: 13, color: 'var(--color-success)', fontWeight: 600 }}>You're saving {formatPrice(discountTotal + couponDiscount)} on this order!</p>
              )}
            </div>

            {/* Coupon */}
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Have a coupon?</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" placeholder="Enter code" value={couponCode} onChange={e => setCouponCode(e.target.value)} className="input-field" style={{ flex: 1, padding: '10px 14px', fontSize: 13, textTransform: 'uppercase' }} />
                <button onClick={applyCoupon} className="btn btn-secondary btn-sm">Apply</button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Try: FLAT10, STYLE20, SAVE500</p>
            </div>

            <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
              <IoBagHandleOutline size={20} /> Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 1fr 380px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default Cart;
