import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLockClosedOutline } from 'react-icons/io5';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password: form.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 40, boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Reset Password</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14, marginBottom: 24 }}>Enter your new password</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <IoLockClosedOutline size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="password" placeholder="New password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ position: 'relative' }}>
            <IoLockClosedOutline size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="input-field" style={{ paddingLeft: 40 }} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
