import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMailOutline } from 'react-icons/io5';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 40, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{sent ? '📧' : '🔑'}</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{sent ? 'Check Your Email' : 'Forgot Password'}</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14, marginBottom: 24 }}>
          {sent ? `We've sent a password reset link to ${email}` : 'Enter your email to receive a reset link'}
        </p>
        {!sent && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <IoMailOutline size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: 40 }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <p style={{ marginTop: 24, fontSize: 14 }}>
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Back to Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
