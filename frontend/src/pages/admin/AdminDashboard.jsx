import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoArrowForwardOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoRefreshOutline,
  IoStorefrontOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { ORDER_STATUSES } from '../../utils/constants';
import { formatDate, formatPrice } from '../../utils/formatPrice';

const STATUS_COLORS = Object.fromEntries(
  Object.entries(ORDER_STATUSES).map(([status, config]) => [status, config.color])
);

const EMPTY_SUMMARY = {
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0,
  processingOrders: 0,
};

const normalizeUser = (user) => ({
  id: user?.id || user?._id || '',
  fullName: user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Unnamed user',
  email: user?.email || '-',
  phone: user?.phone || '-',
  role: user?.role || 'USER',
  createdAt: user?.createdAt || null,
});

const normalizeOrder = (order) => ({
  id: order?.id || order?._id || '',
  customerName: order?.customerName || order?.user || 'Unknown customer',
  customerEmail: order?.customerEmail || order?.email || '-',
  customerPhone: order?.customerPhone || '-',
  itemCount: order?.itemCount ?? (Array.isArray(order?.items)
    ? order.items.reduce((count, item) => count + (item?.quantity || 1), 0)
    : order?.items ?? 0),
  total: order?.total ?? order?.totalDiscountedPrice ?? order?.totalPrice ?? 0,
  status: order?.status || order?.orderStatus || 'PROCESSING',
  paymentMethod: order?.paymentMethod || '-',
  paymentStatus: order?.paymentStatus || '-',
  shippingLocation: order?.shippingLocation || '-',
  createdAt: order?.createdAt || order?.date || null,
});

const AdminDashboard = () => {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchAdminData = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [dashboardRes, ordersRes, usersRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getOrders({}),
        adminApi.getUsers({}),
      ]);

      const normalizedOrders = (ordersRes.data || []).map(normalizeOrder);
      const normalizedUsers = (usersRes.data || []).map(normalizeUser);
      const dashboardData = dashboardRes.data || {};

      setSummary({
        totalRevenue: dashboardData.totalRevenue ?? normalizedOrders.reduce((total, order) => total + order.total, 0),
        totalOrders: dashboardData.totalOrders ?? normalizedOrders.length,
        totalUsers: dashboardData.totalUsers ?? normalizedUsers.length,
        processingOrders: dashboardData.processingOrders ?? normalizedOrders.filter((order) => order.status === 'PROCESSING').length,
      });
      setOrders(normalizedOrders);
      setUsers(normalizedUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load admin dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const statCards = useMemo(() => ([
    { label: 'Revenue', value: formatPrice(summary.totalRevenue), icon: IoCashOutline, color: '#00B894', bg: '#00B89420' },
    { label: 'Total Orders', value: summary.totalOrders, icon: IoReceiptOutline, color: '#0984E3', bg: '#0984E320' },
    { label: 'Customers', value: summary.totalUsers, icon: IoPeopleOutline, color: '#F39C12', bg: '#F39C1220' },
    { label: 'Processing', value: summary.processingOrders, icon: IoTimeOutline, color: '#8E44AD', bg: '#8E44AD20' },
  ]), [summary]);

  const recentUsers = useMemo(() => users.slice(0, 6), [users]);

  const orderHealth = useMemo(() => ([
    { label: 'Delivered', value: orders.filter((order) => order.status === 'DELIVERED').length, icon: IoCheckmarkCircleOutline, color: '#00B894' },
    { label: 'Shipped', value: orders.filter((order) => order.status === 'SHIPPED').length, icon: IoArrowForwardOutline, color: '#0984E3' },
    { label: 'Processing', value: orders.filter((order) => order.status === 'PROCESSING').length, icon: IoTimeOutline, color: '#F39C12' },
  ]), [orders]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    setUpdatingOrderId(orderId);

    try {
      const response = await adminApi.updateOrderStatus(orderId, status);
      const nextStatus = response.data?.orderStatus || status;
      let nextOrdersSnapshot = [];

      setOrders((currentOrders) => {
        nextOrdersSnapshot = currentOrders.map((order) => (
          order.id === orderId ? { ...order, status: nextStatus } : order
        ));
        return nextOrdersSnapshot;
      });

      setSummary((currentSummary) => ({
        ...currentSummary,
        processingOrders: nextOrdersSnapshot.filter((order) => order.status === 'PROCESSING').length,
      }));

      toast.success(`Order ${orderId} updated to ${nextStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update order');
    } finally {
      setUpdatingOrderId(null);
    }
  }, []);

  if (loading) {
    return <Loader size="lg" text="Loading admin dashboard..." />;
  }

  return (
    <div className="container-main" style={{ paddingTop: 28, paddingBottom: 56 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 8 }}>Admin Dashboard</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)' }}>Orders, customers, and updates in one place</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, maxWidth: 720 }}>This panel is now focused only on the details you need: customer accounts, order visibility, and order status updates.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => fetchAdminData({ silent: true })} className="btn btn-secondary" disabled={refreshing}>
            <IoRefreshOutline size={18} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link to="/" className="btn btn-primary">
            <IoStorefrontOutline size={18} />
            View Store
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 24 }}>
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="card"
            style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-secondary)' }}>{stat.label}</p>
              <p style={{ fontSize: 25, fontWeight: 800, marginTop: 2 }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginBottom: 24 }} className="admin-summary-grid">
        <div className="card" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Order status snapshot</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 18 }}>A quick view of how your current order pipeline is moving.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }} className="admin-health-grid">
            {orderHealth.map((item) => (
              <div key={item.label} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <item.icon size={18} color={item.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Newest users</h2>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{recentUsers.length} shown</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentUsers.length === 0 && <p style={{ color: 'var(--color-text-secondary)' }}>No users yet.</p>}
            {recentUsers.map((user) => (
              <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>{user.fullName}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user.email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: user.role === 'ADMIN' ? 'rgba(9,132,227,0.12)' : 'rgba(0,184,148,0.12)', color: user.role === 'ADMIN' ? '#0984E3' : '#00B894', fontSize: 12, fontWeight: 700 }}>{user.role}</span>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 22, marginBottom: 24, overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Order management</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>Review customer details, payment state, and update order progress directly from here.</p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-secondary)' }}>{orders.length} total orders</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              {['Order', 'Customer', 'Location', 'Payment', 'Total', 'Status', 'Update'].map((heading) => (
                <th key={heading} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>No orders found yet.</td>
              </tr>
            )}
            {orders.map((order) => {
              const statusColor = STATUS_COLORS[order.status] || '#7F8C8D';

              return (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px' }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{order.id}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(order.createdAt)}</p>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <p style={{ fontSize: 14, fontWeight: 700 }}>{order.customerName}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{order.customerEmail}</p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{order.customerPhone}</p>
                  </td>
                  <td style={{ padding: '14px', fontSize: 13 }}>
                    <p>{order.shippingLocation}</p>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>{order.itemCount} item(s)</p>
                  </td>
                  <td style={{ padding: '14px', fontSize: 13 }}>
                    <p style={{ fontWeight: 700, textTransform: 'capitalize' }}>{order.paymentMethod || '-'}</p>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>{order.paymentStatus}</p>
                  </td>
                  <td style={{ padding: '14px', fontSize: 14, fontWeight: 800 }}>{formatPrice(order.total)}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 700, background: `${statusColor}20`, color: statusColor }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <select
                      value={order.status}
                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                      disabled={updatingOrderId === order.id}
                      style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', minWidth: 150 }}
                    >
                      {Object.keys(ORDER_STATUSES).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ padding: 22, overflowX: 'auto' }}>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Customer accounts</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>A simple view of who has signed up and when they joined.</p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              {['Customer', 'Email', 'Phone', 'Role', 'Joined'].map((heading) => (
                <th key={heading} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>No users found yet.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '14px', fontSize: 14, fontWeight: 700 }}>{user.fullName}</td>
                <td style={{ padding: '14px', fontSize: 14 }}>{user.email}</td>
                <td style={{ padding: '14px', fontSize: 14 }}>{user.phone}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: user.role === 'ADMIN' ? 'rgba(9,132,227,0.12)' : 'rgba(0,184,148,0.12)', color: user.role === 'ADMIN' ? '#0984E3' : '#00B894', fontSize: 12, fontWeight: 700 }}>{user.role}</span>
                </td>
                <td style={{ padding: '14px', fontSize: 13, color: 'var(--color-text-secondary)' }}>{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-summary-grid {
            grid-template-columns: 1fr !important;
          }

          .admin-health-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
