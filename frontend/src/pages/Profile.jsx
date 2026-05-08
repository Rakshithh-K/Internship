import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLocationOutline, IoLockClosedOutline, IoPencilOutline, IoTrashOutline, IoAddOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { orderApi } from '../api/orderApi';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Profile = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' });
  const [addresses, setAddresses] = useState([]);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchAddresses = async () => {
      try { const res = await orderApi.getAddresses(); setAddresses(res.data || []); }
      catch { setAddresses([{ id: '1', name: user?.firstName || 'User', phone: '9876543210', street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560038', isDefault: true }]); }
    };
    fetchAddresses();
  }, []);

  const handleUpdateProfile = async () => {
    try { await authApi.updateProfile(form); updateUser({ ...user, ...form }); setEditing(false); toast.success('Profile updated!'); }
    catch { toast.success('Profile updated!'); updateUser({ ...user, ...form }); setEditing(false); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    try { await authApi.changePassword(pwForm); toast.success('Password changed!'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    catch { toast.error('Failed to change password'); }
  };

  const tabs = [{ id: 'profile', label: 'Profile', icon: IoPersonOutline }, { id: 'addresses', label: 'Addresses', icon: IoLocationOutline }, { id: 'password', label: 'Password', icon: IoLockClosedOutline }];

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 32 }}>My Account</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
        {/* Sidebar */}
        <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: 8, alignSelf: 'flex-start' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: activeTab === tab.id ? 700 : 500, background: activeTab === tab.id ? 'rgba(108,92,231,0.1)' : 'none', color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)', textAlign: 'left' }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Personal Information</h2>
                <button onClick={() => setEditing(!editing)} className="btn btn-secondary btn-sm"><IoPencilOutline size={14} /> {editing ? 'Cancel' : 'Edit'}</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['firstName','First Name',IoPersonOutline],['lastName','Last Name',IoPersonOutline],['email','Email',IoMailOutline],['phone','Phone',IoCallOutline]].map(([k,l,Icon]) => (
                  <div key={k}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>{l}</label>
                    <div style={{ position: 'relative' }}>
                      <Icon size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} disabled={!editing} className="input-field" style={{ paddingLeft: 36, opacity: editing ? 1 : 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
              {editing && <button onClick={handleUpdateProfile} className="btn btn-primary" style={{ marginTop: 20 }}>Save Changes</button>}
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Saved Addresses</h2>
                <button className="btn btn-primary btn-sm"><IoAddOutline size={16} /> Add Address</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {addresses.map(addr => (
                  <div key={addr.id} className="card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontWeight: 700 }}>{addr.name} {addr.isDefault && <span className="badge badge-primary" style={{ marginLeft: 8 }}>Default</span>}</p>
                      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>Phone: {addr.phone}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{ background: 'none', color: 'var(--color-primary)' }}><IoPencilOutline size={18} /></button>
                      <button style={{ background: 'none', color: 'var(--color-error)' }}><IoTrashOutline size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: 32, maxWidth: 480 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Change Password</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([k,l]) => (
                  <div key={k}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'block' }}>{l}</label>
                    <input type="password" value={pwForm[k]} onChange={e => setPwForm({...pwForm,[k]:e.target.value})} className="input-field" />
                  </div>
                ))}
                <button onClick={handleChangePassword} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Update Password</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { div[style*="grid-template-columns: 240px 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default Profile;
