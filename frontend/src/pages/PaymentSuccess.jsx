import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoCheckmarkCircleOutline, IoHomeOutline, IoReceiptOutline } from 'react-icons/io5';

const PaymentSuccess = () => (
  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: 'center', maxWidth: 500 }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
        <IoCheckmarkCircleOutline size={100} color="var(--color-success)" />
      </motion.div>
      <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 24 }}>Order Placed!</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
        Your order has been confirmed and will be shipped soon. You'll receive an email confirmation shortly.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
        <Link to="/orders" className="btn btn-primary"><IoReceiptOutline size={18} /> View Orders</Link>
        <Link to="/" className="btn btn-secondary"><IoHomeOutline size={18} /> Continue Shopping</Link>
      </div>
    </motion.div>
  </div>
);

export default PaymentSuccess;
