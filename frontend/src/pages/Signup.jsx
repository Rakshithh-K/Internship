import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoCallOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = ({ icon: Icon, type = 'text', placeholder, name, form, setForm, errors, setErrors, showPassword, setShowPassword }) => (
  <div>
    <div style={{ position: 'relative' }}>
      <Icon size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
      <input type={type === 'password' ? (showPassword ? 'text' : 'password') : type} placeholder={placeholder} value={form[name]}
        onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
        className="input-field" style={{ paddingLeft: 40 }} />
      {type === 'password' && (
        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--color-text-muted)' }}>
          {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
        </button>
      )}
    </div>
    {errors[name] && <p style={{ color: 'var(--color-error)', fontSize: 12, marginTop: 4 }}>{errors[name]}</p>}
  </div>
);

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const trimmedForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
    };
    const errs = {};

    if (!trimmedForm.firstName) errs.firstName = 'First name is required';
    else if (trimmedForm.firstName.length < 2) errs.firstName = 'First name must be at least 2 characters';

    if (!trimmedForm.lastName) errs.lastName = 'Last name is required';
    else if (trimmedForm.lastName.length < 2) errs.lastName = 'Last name must be at least 2 characters';

    if (!trimmedForm.email) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(trimmedForm.email)) errs.email = 'Enter a valid email address';

    if (!trimmedForm.phone) errs.phone = 'Phone number is required';

    if (!trimmedForm.password) errs.password = 'Password is required';
    else if (trimmedForm.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!trimmedForm.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (trimmedForm.password !== trimmedForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const result = await signup(form);
    if (result.success) {
      navigate(result.requiresLogin ? '/login' : '/');
      return;
    }

    if (result.validationErrors) {
      setErrors(result.validationErrors);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 480, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 40, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, fontFamily: 'var(--font-display)', margin: '0 auto 16px' }}>S</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14 }}>Join StyleSphere for exclusive access</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field icon={IoPersonOutline} placeholder="First Name" name="firstName" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
            <Field icon={IoPersonOutline} placeholder="Last Name" name="lastName" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          </div>
          <Field icon={IoMailOutline} type="email" placeholder="Email address" name="email" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          <Field icon={IoCallOutline} type="tel" placeholder="Phone number" name="phone" form={form} setForm={setForm} errors={errors} setErrors={setErrors} />
          <Field icon={IoLockClosedOutline} type="password" placeholder="Password (min 6 chars)" name="password" form={form} setForm={setForm} errors={errors} setErrors={setErrors} showPassword={showPassword} setShowPassword={setShowPassword} />
          <Field icon={IoLockClosedOutline} type="password" placeholder="Confirm password" name="confirmPassword" form={form} setForm={setForm} errors={errors} setErrors={setErrors} showPassword={showPassword} setShowPassword={setShowPassword} />
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
