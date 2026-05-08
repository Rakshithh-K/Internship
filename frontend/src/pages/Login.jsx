import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const result = await login(form);
    if (result.success) {
      navigate(result.user?.role === 'ADMIN' ? '/admin' : '/');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 40, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, fontFamily: 'var(--font-display)', margin: '0 auto 16px' }}>S</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14 }}>Sign in to your StyleSphere account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ position: 'relative' }}>
              <IoMailOutline size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                className="input-field" style={{ paddingLeft: 40 }} />
            </div>
            {errors.email && <p style={{ color: 'var(--color-error)', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
          </div>
          <div>
            <div style={{ position: 'relative' }}>
              <IoLockClosedOutline size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className="input-field" style={{ paddingLeft: 40, paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--color-text-muted)' }}>
                {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
              </button>
            </div>
            {errors.password && <p style={{ color: 'var(--color-error)', fontSize: 12, marginTop: 4 }}>{errors.password}</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
