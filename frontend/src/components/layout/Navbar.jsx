import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline, IoPersonOutline, IoHeartOutline, IoBagHandleOutline,
  IoSunnyOutline, IoMoonOutline, IoMenuOutline, IoCloseOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { CATEGORIES } from '../../utils/constants';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminArea = isAdmin && location.pathname.startsWith('/admin');
  const profileLinks = isAdmin
    ? [{ to: '/admin', label: 'Admin Dashboard' }, { to: '/profile', label: 'My Profile' }]
    : [{ to: '/profile', label: 'My Profile' }, { to: '/orders', label: 'My Orders' }, { to: '/wishlist', label: 'Wishlist' }];

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'var(--color-surface)',
    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
    transition: 'all var(--transition-base)',
  };

  const catLinks = (gender) => CATEGORIES.slice(0, 8).map((cat) => (
    <Link key={cat.slug} to={`/products?gender=${gender}&category=${cat.slug}`}
      style={{ padding: '8px 16px', fontSize: 14, color: 'var(--color-text-secondary)', display: 'block', borderRadius: 'var(--radius-sm)' }}
    >{cat.icon} {cat.name}</Link>
  ));

  const IconBtn = ({ children, to, count, onClick, style: s }) => {
    const inner = (
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', position: 'relative', color: 'var(--color-text)', ...s }}>
        {children}
        {count > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--color-accent)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count}</span>}
      </div>
    );
    if (to) return <Link to={to}>{inner}</Link>;
    return <button onClick={onClick} style={{ background: 'none' }}>{inner}</button>;
  };

  return (
    <>
      <nav style={navStyle} id="main-navbar">
        <div className="container-main" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 24 }}>
          <button onClick={() => setMobileMenuOpen(true)} className="mobile-menu-btn" style={{ display: 'none', background: 'none', color: 'var(--color-text)' }}><IoMenuOutline size={26} /></button>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)' }}>S</div>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, fontFamily: 'var(--font-display)' }}>StyleSphere</span>
          </Link>

          {!isAdminArea && <div className="nav-links" style={{ display: 'flex', gap: 4, marginLeft: 16, alignItems: 'center' }}>
            {['Men', 'Women'].map(g => (
              <div key={g} onMouseEnter={() => setActiveDropdown(g)} onMouseLeave={() => setActiveDropdown(null)} style={{ position: 'relative' }}>
                <Link to={`/products?gender=${g}`} style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, borderRadius: 'var(--radius-sm)' }}>
                  {g} <IoChevronDownOutline size={12} />
                </Link>
                <AnimatePresence>
                  {activeDropdown === g && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 8, minWidth: 220, zIndex: 200 }}>
                      {catLinks(g)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link to="/products?trending=true" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Trending</Link>
            <Link to="/products?newArrivals=true" style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>New</Link>
          </div>}

          <div style={{ flex: 1 }} />

          {!isAdminArea && <div className="search-desktop" style={{ position: 'relative', width: 260 }}>
            <form onSubmit={handleSearch}>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products, brands..."
                style={{ width: '100%', padding: '10px 40px 10px 16px', background: 'var(--color-surface-hover)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: 13, color: 'var(--color-text)' }} />
              <button type="submit" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--color-text-secondary)' }}><IoSearchOutline size={18} /></button>
            </form>
          </div>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {!isAdminArea && <button onClick={() => setSearchOpen(!searchOpen)} className="search-mobile-btn" style={{ display: 'none', width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: 'none', color: 'var(--color-text)' }}><IoSearchOutline size={22} /></button>}
            {isAdminArea && <Link to="/" style={{ padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: 13, fontWeight: 600 }}>View Store</Link>}
            {isAdmin && !isAdminArea && <Link to="/admin" style={{ padding: '10px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>Admin Dashboard</Link>}
            <IconBtn onClick={toggleTheme}>{theme === 'light' ? <IoMoonOutline size={20} /> : <IoSunnyOutline size={20} />}</IconBtn>
            {!isAdminArea && <IconBtn to="/wishlist" count={wishlistCount}><IoHeartOutline size={22} /></IconBtn>}
            {!isAdminArea && <IconBtn to="/cart" count={cartCount}><IoBagHandleOutline size={22} /></IconBtn>}

            <div ref={profileRef} style={{ position: 'relative' }}>
              <button onClick={() => isAuthenticated ? setProfileOpen(!profileOpen) : navigate('/login')}
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', background: isAuthenticated ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'none', color: isAuthenticated ? '#fff' : 'var(--color-text)', fontSize: 14, fontWeight: 700 }}>
                {isAuthenticated ? user?.firstName?.charAt(0)?.toUpperCase() : <IoPersonOutline size={22} />}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                    style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 8, minWidth: 200, zIndex: 200 }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{user?.firstName} {user?.lastName}</p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user?.email}</p>
                    </div>
                    {profileLinks.map(l=>(
                      <Link key={l.to} to={l.to} style={{ display:'block', padding:'10px 16px', fontSize:14, borderRadius:'var(--radius-sm)' }}>{l.label}</Link>
                    ))}
                    {isAdmin && !isAdminArea && <Link to="/admin" style={{ display:'block', padding:'10px 16px', fontSize:14, borderRadius:'var(--radius-sm)', color:'var(--color-primary)', fontWeight:600 }}>Admin Panel</Link>}
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 4, paddingTop: 4 }}>
                      <button onClick={() => { logout(); navigate('/login'); }} style={{ display:'block', width:'100%', padding:'10px 16px', fontSize:14, textAlign:'left', borderRadius:'var(--radius-sm)', color:'var(--color-error)', background:'none' }}>Logout</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 300, background: 'var(--color-surface)', zIndex: 200, overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', color: 'var(--color-text)' }}><IoCloseOutline size={26} /></button>
              </div>
              <div style={{ padding: 16 }}>
                {isAuthenticated && <div style={{ padding: '16px 0', borderBottom: '1px solid var(--color-border)', marginBottom: 16 }}><p style={{ fontWeight: 700 }}>Hi, {user?.firstName}!</p></div>}
                {['Men','Women'].map(g => (
                  !isAdminArea &&
                  <div key={g}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 0' }}>{g}</p>
                    {CATEGORIES.slice(0, 7).map(cat => (
                      <Link key={`${g}-${cat.slug}`} to={`/products?gender=${g}&category=${cat.slug}`} style={{ padding: '10px 12px', fontSize: 14, display: 'block', borderRadius: 'var(--radius-sm)' }}>{cat.icon} {cat.name}</Link>
                    ))}
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 16, paddingTop: 16 }}>
                  {!isAuthenticated ? <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login / Signup</Link> : (
                    <>
                      {profileLinks.map(link => (
                        <Link key={link.to} to={link.to} style={{ display:'block', padding:'10px 12px', fontSize:14 }}>{link.label}</Link>
                      ))}
                      {isAdmin && !isAdminArea && <Link to="/admin" style={{ display:'block', padding:'10px 12px', fontSize:14, color:'var(--color-primary)', fontWeight:600 }}>Admin Panel</Link>}
                      <button onClick={() => { logout(); navigate('/login'); }} style={{ display:'block', padding:'10px 12px', fontSize:14, color:'var(--color-error)', background:'none', width:'100%', textAlign:'left' }}>Logout</button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ height: 68 }} />

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .search-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
