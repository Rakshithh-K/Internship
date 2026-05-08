import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoCloseCircleOutline } from 'react-icons/io5';

const PaymentFailure = () => (
  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', maxWidth: 500 }}>
      <IoCloseCircleOutline size={100} color="var(--color-error)" />
      <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 24 }}>Payment Failed</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 12, fontSize: 16 }}>
        Something went wrong with your payment. Please try again.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <Link to="/cart" className="btn btn-primary">Try Again</Link>
        <Link to="/" className="btn btn-secondary">Go Home</Link>
      </div>
    </motion.div>
  </div>
);

export default PaymentFailure;
