import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoLocationOutline, IoAddOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { formatPrice } from '../utils/formatPrice';
import { PAYMENT_METHODS, DEMO_COUPONS } from '../utils/constants';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, isServerAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);

  const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const discount = cartItems.reduce((a, i) => a + (i.price - (i.discountedPrice || i.price)) * i.quantity, 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + delivery;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (cartItems.length === 0) { navigate('/cart'); return; }

    const fetchAddresses = async () => {
      if (!isServerAuthenticated) {
        const localAddresses = JSON.parse(localStorage.getItem('checkoutAddresses') || '[]');

        if (localAddresses.length > 0) {
          setAddresses(localAddresses);
          return;
        }

        setAddresses([
          { id: '1', name: user?.firstName || 'User', phone: '9876543210', street: '123 MG Road, Indiranagar', city: 'Bangalore', state: 'Karnataka', pincode: '560038', isDefault: true },
        ]);
        return;
      }

      try {
        const res = await orderApi.getAddresses();
        setAddresses(res.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load saved addresses');
        setAddresses([]);
      }
    };
    fetchAddresses();
  }, [isAuthenticated, isServerAuthenticated, cartItems, navigate, user]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const def = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(def.id);
    }
  }, [addresses]);

  const handleAddAddress = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error('Please fill all address fields'); return;
    }

    if (isServerAuthenticated) {
      try {
        const res = await orderApi.addAddress({
          ...addressForm,
          isDefault: addresses.length === 0,
        });
        const newAddr = res.data;
        setAddresses((current) => [...current, newAddr]);
        setSelectedAddress(newAddr.id);
        setShowAddressForm(false);
        setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
        toast.success('Address added!');
        return;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to save address');
        return;
      }
    }

    const newAddr = { ...addressForm, id: `new-${Date.now()}`, isDefault: addresses.length === 0 };
    const updatedAddresses = [...addresses, newAddr];
    setAddresses(updatedAddresses);
    setSelectedAddress(newAddr.id);
    setShowAddressForm(false);
    setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
    localStorage.setItem('checkoutAddresses', JSON.stringify(updatedAddresses));
    toast.success('Address added!');
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) { toast.error('Please select a payment method'); return; }
    const addr = addresses.find(a => a.id === selectedAddress);

    if (!addr) {
      toast.error('Please select a valid address');
      return;
    }

    setProcessing(true);
    try {
      await orderApi.createOrder({
        items: cartItems,
        shippingAddress: addr,
        paymentMethod: selectedPayment,
        totalPrice: subtotal,
        totalDiscountedPrice: total,
      });

      await clearCart();
      navigate('/payment-success');
    } catch (error) {
      if (isServerAuthenticated) {
        toast.error(error.response?.data?.message || 'Unable to place order right now');
        return;
      }

      const newOrder = {
        id: `ORD-DEMO-${Date.now()}`,
        user: user?.firstName || 'Demo User',
        email: user?.email || 'demo@example.com',
        total: total,
        status: 'PROCESSING',
        date: new Date().toISOString(),
        items: cartItems.length,
        orderItems: cartItems,
      };
      const existing = JSON.parse(localStorage.getItem('demoOrders') || '[]');
      localStorage.setItem('demoOrders', JSON.stringify([newOrder, ...existing]));
      await clearCart();
      navigate('/payment-success');
    } finally {
      setProcessing(false);
    }
  };

  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {[{ n: 1, l: 'Address' }, { n: 2, l: 'Summary' }, { n: 3, l: 'Payment' }].map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, background: step >= s.n ? 'var(--color-primary)' : 'var(--color-surface-hover)', color: step >= s.n ? '#fff' : 'var(--color-text-muted)', transition: 'all 0.3s' }}>
              {step > s.n ? <IoCheckmarkCircle size={20} /> : s.n}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: step >= s.n ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{s.l}</span>
          </div>
          {i < 2 && <div style={{ width: 60, height: 2, background: step > s.n ? 'var(--color-primary)' : 'var(--color-border)', margin: '0 8px', marginBottom: 20 }} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60, maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 8 }}>Checkout</h1>
      <StepIndicator />

      {/* Step 1: Address */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Select Delivery Address</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {addresses.map(addr => (
              <div key={addr.id} onClick={() => setSelectedAddress(addr.id)} className="card"
                style={{ padding: 20, cursor: 'pointer', border: selectedAddress === addr.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (selectedAddress === addr.id ? 'var(--color-primary)' : 'var(--color-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedAddress === addr.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{addr.name} <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 400 }}>({addr.phone})</span></p>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowAddressForm(!showAddressForm)} className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <IoAddOutline size={18} /> Add New Address
            </button>
            {showAddressForm && (
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[['name','Full Name'],['phone','Phone'],['street','Street Address'],['city','City'],['state','State'],['pincode','Pincode']].map(([k,l]) => (
                    <input key={k} placeholder={l} value={addressForm[k]} onChange={e => setAddressForm({...addressForm,[k]:e.target.value})}
                      className="input-field" style={k === 'street' ? { gridColumn: '1/-1' } : {}} />
                  ))}
                </div>
                <button onClick={handleAddAddress} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Save Address</button>
              </div>
            )}
          </div>
          <button onClick={() => { if(!selectedAddress){toast.error('Select an address');return;} setStep(2); }} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 24 }}>Continue</button>
        </motion.div>
      )}

      {/* Step 2: Summary */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>
          <div className="card" style={{ padding: 20, marginBottom: 20 }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: idx < cartItems.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <img src={item.image || `https://picsum.photos/seed/${idx+600}/60/75`} style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Size: {item.size} | Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 700 }}>{formatPrice((item.discountedPrice||item.price)*item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            {[['Subtotal',formatPrice(subtotal)],['Discount',`−${formatPrice(discount)}`],['Delivery',delivery===0?'FREE':formatPrice(delivery)]].map(([l,v])=>(
              <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',fontSize:14}}><span style={{color:'var(--color-text-secondary)'}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
            ))}
            <div style={{borderTop:'1px solid var(--color-border)',marginTop:8,paddingTop:8,display:'flex',justifyContent:'space-between',fontSize:18}}><span style={{fontWeight:800}}>Total</span><span style={{fontWeight:800}}>{formatPrice(total)}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>Back</button>
            <button onClick={() => setStep(3)} className="btn btn-primary btn-lg" style={{ flex: 2 }}>Proceed to Payment</button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Select Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PAYMENT_METHODS.map(pm => (
              <div key={pm.id} onClick={() => setSelectedPayment(pm.id)} className="card"
                style={{ padding: 20, cursor: 'pointer', border: selectedPayment === pm.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (selectedPayment === pm.id ? 'var(--color-primary)' : 'var(--color-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedPayment === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                </div>
                <span style={{ fontSize: 24 }}>{pm.icon}</span>
                <div>
                  <p style={{ fontWeight: 700 }}>{pm.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{pm.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary btn-lg" style={{ flex: 1 }}>Back</button>
            <button onClick={handlePlaceOrder} className="btn btn-primary btn-lg" style={{ flex: 2 }} disabled={processing}>
              {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Checkout;
