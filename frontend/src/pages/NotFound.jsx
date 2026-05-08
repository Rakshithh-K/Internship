import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 120, fontWeight: 900, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 16, fontFamily: 'var(--font-display)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 12, fontSize: 16 }}>The page you're looking for doesn't exist or has been moved.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/products" className="btn btn-secondary">Browse Products</Link>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
