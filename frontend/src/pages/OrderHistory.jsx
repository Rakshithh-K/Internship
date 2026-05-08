import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/formatPrice';
import { ORDER_STATUSES } from '../utils/constants';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { isServerAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isServerAuthenticated) {
        const stored = JSON.parse(localStorage.getItem('demoOrders') || '[]');
        const mappedStored = stored.map(o => ({
          id: o.id, createdAt: o.date, totalPrice: o.total, totalDiscountedPrice: o.total, orderStatus: o.status, paymentMethod: 'card', items: o.orderItems || []
        }));
        setOrders(mappedStored);
        setLoading(false);
        return;
      }

      try {
        const res = await orderApi.getOrders();
        setOrders(res.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load your orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isServerAuthenticated]);

  if (loading) return <Loader size="lg" text="Loading orders..." />;

  if (orders.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 80 }}>📦</div>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>No orders yet</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Start shopping to see your orders here</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 32 }}>My Orders</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map((order, idx) => {
          const status = ORDER_STATUSES[order.orderStatus] || { label: order.orderStatus, color: '#888' };
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 700 }}>Order #{order.id}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, background: `${status.color}20`, color: status.color }}>{status.label}</span>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px solid var(--color-border)' }}>
                  <img src={item.image || `https://picsum.photos/seed/${idx*10+i+900}/60/75`} style={{ width: 60, height: 75, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(item.price)}</p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800 }}>Total: {formatPrice(order.totalDiscountedPrice || order.totalPrice)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
