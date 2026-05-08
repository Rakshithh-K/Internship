import { Link, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoGridOutline, IoBagHandleOutline, IoHeartOutline, IoPersonOutline } from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const MobileNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const tabs = [
    { to: '/', icon: IoHomeOutline, label: 'Home' },
    { to: '/products', icon: IoGridOutline, label: 'Shop' },
    { to: '/cart', icon: IoBagHandleOutline, label: 'Cart', badge: cartCount },
    { to: '/wishlist', icon: IoHeartOutline, label: 'Wishlist', badge: wishlistCount },
    { to: '/profile', icon: IoPersonOutline, label: 'Profile' },
  ];

  return (
    <>
      <div className="mobile-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        display: 'none', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
          {tabs.map(tab => {
            const active = location.pathname === tab.to || (tab.to !== '/' && location.pathname.startsWith(tab.to));
            return (
              <Link key={tab.to} to={tab.to} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                fontSize: 10, fontWeight: active ? 700 : 500, padding: '4px 12px',
                color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                position: 'relative', textDecoration: 'none',
              }}>
                <div style={{ position: 'relative' }}>
                  <tab.icon size={22} />
                  {tab.badge > 0 && (
                    <span style={{
                      position: 'absolute', top: -4, right: -8,
                      width: 16, height: 16, borderRadius: '50%',
                      background: 'var(--color-accent)', color: '#fff',
                      fontSize: 9, fontWeight: 700, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>{tab.badge}</span>
                  )}
                </div>
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .mobile-bottom-nav { display: block !important; }
          body { padding-bottom: 68px; }
        }
      `}</style>
    </>
  );
};

export default MobileNav;
