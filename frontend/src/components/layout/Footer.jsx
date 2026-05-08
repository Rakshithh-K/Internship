import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoTwitter, IoLogoFacebook, IoLogoYoutube, IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { CATEGORIES } from '../../utils/constants';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', marginTop: 80 }}>
      <div className="container-main" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)' }}>S</div>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)' }}>StyleSphere</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
              Your premium destination for fashion. Discover the latest trends, exclusive collections, and timeless styles.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[IoLogoInstagram, IoLogoTwitter, IoLogoFacebook, IoLogoYoutube].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 40, height: 40, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', transition: 'all var(--transition-fast)' }}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Shop</h4>
            {CATEGORIES.slice(0, 7).map(cat => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`} style={{ display: 'block', fontSize: 14, color: 'var(--color-text-secondary)', padding: '6px 0', transition: 'color var(--transition-fast)' }}>{cat.name}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Company</h4>
            {['About Us', 'Careers', 'Press', 'Blog', 'Sustainability', 'Affiliate Program'].map(item => (
              <a key={item} href="#" style={{ display: 'block', fontSize: 14, color: 'var(--color-text-secondary)', padding: '6px 0' }}>{item}</a>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Support</h4>
            {['Help Center', 'Shipping Info', 'Returns & Exchange', 'Size Guide', 'Track Order', 'Privacy Policy'].map(item => (
              <a key={item} href="#" style={{ display: 'block', fontSize: 14, color: 'var(--color-text-secondary)', padding: '6px 0' }}>{item}</a>
            ))}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}><IoMailOutline size={16} /> support@stylesphere.com</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}><IoCallOutline size={16} /> 1800-123-4567</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 40, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>© 2026 StyleSphere. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <a key={item} href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
