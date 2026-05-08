import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoGridOutline, IoCubeOutline, IoReceiptOutline, IoPeopleOutline } from 'react-icons/io5';
import { adminApi } from '../../api/adminApi';
import { formatPrice, formatDate } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const sidebar = [
  { to: '/admin', icon: IoGridOutline, label: 'Dashboard' },
  { to: '/admin/products', icon: IoCubeOutline, label: 'Products' },
  { to: '/admin/orders', icon: IoReceiptOutline, label: 'Orders', active: true },
  { to: '/admin/users', icon: IoPeopleOutline, label: 'Users' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try { const r = await adminApi.getOrders({}); setOrders(r.data?.content||r.data||[]); }
      catch { 
        const stored = JSON.parse(localStorage.getItem('demoOrders') || '[]');
        setOrders([...stored,
        { id:'ORD-001',user:'Rahul S.',email:'rahul@example.com',total:2498,status:'PROCESSING',date:'2026-05-07',items:2 },
        { id:'ORD-002',user:'Priya M.',email:'priya@example.com',total:3999,status:'SHIPPED',date:'2026-05-06',items:1 },
        { id:'ORD-003',user:'Arjun K.',email:'arjun@example.com',total:1299,status:'DELIVERED',date:'2026-05-05',items:3 },
        { id:'ORD-004',user:'Sneha R.',email:'sneha@example.com',total:5699,status:'PROCESSING',date:'2026-05-04',items:2 },
        { id:'ORD-005',user:'Vikram P.',email:'vikram@example.com',total:899,status:'CANCELLED',date:'2026-05-03',items:1 },
      ]); }
    };
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    try { await adminApi.updateOrderStatus(id, status); } catch {}
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    const stored = JSON.parse(localStorage.getItem('demoOrders') || '[]');
    const updatedStored = stored.map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem('demoOrders', JSON.stringify(updatedStored));
    toast.success(`Order ${id} marked as ${status}`);
  };

  const statusColors = { PROCESSING:'#FDCB6E', SHIPPED:'#74B9FF', DELIVERED:'#00B894', CANCELLED:'#FF6B6B' };

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 68px)'}}>
      <div className="admin-sidebar" style={{width:240,background:'var(--color-surface)',borderRight:'1px solid var(--color-border)',padding:16,flexShrink:0}}>
        <h3 style={{fontSize:14,fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:1,padding:'12px 16px'}}>Admin Panel</h3>
        {sidebar.map(i=><Link key={i.to} to={i.to} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRadius:'var(--radius-sm)',fontSize:14,fontWeight:i.active?700:500,background:i.active?'rgba(108,92,231,0.1)':'none',color:i.active?'var(--color-primary)':'var(--color-text-secondary)',marginBottom:4}}><i.icon size={18}/>{i.label}</Link>)}
      </div>
      <div style={{flex:1,padding:32}}>
        <h1 style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)',marginBottom:24}}>Orders</h1>
        <div className="card" style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid var(--color-border)'}}>
              {['Order ID','Customer','Total','Items','Status','Date','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'14px 16px',fontSize:12,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o.id} style={{borderBottom:'1px solid var(--color-border)'}}>
                  <td style={{padding:'14px 16px',fontSize:14,fontWeight:600}}>{o.id}</td>
                  <td style={{padding:'14px 16px'}}><p style={{fontSize:14,fontWeight:600}}>{o.user}</p><p style={{fontSize:12,color:'var(--color-text-muted)'}}>{o.email}</p></td>
                  <td style={{padding:'14px 16px',fontSize:14,fontWeight:600}}>{formatPrice(o.total)}</td>
                  <td style={{padding:'14px 16px',fontSize:14}}>{o.items}</td>
                  <td style={{padding:'14px 16px'}}><span style={{padding:'4px 12px',borderRadius:'var(--radius-full)',fontSize:12,fontWeight:700,background:`${statusColors[o.status]}20`,color:statusColors[o.status]}}>{o.status}</span></td>
                  <td style={{padding:'14px 16px',fontSize:13,color:'var(--color-text-muted)'}}>{o.date}</td>
                  <td style={{padding:'14px 16px'}}>
                    <select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)} style={{padding:'6px 10px',borderRadius:'var(--radius-sm)',border:'1px solid var(--color-border)',fontSize:13,background:'var(--color-surface)',color:'var(--color-text)'}}>
                      {Object.keys(ORDER_STATUSES).map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@media(max-width:768px){.admin-sidebar{display:none;}}`}</style>
    </div>
  );
};

export default AdminOrders;
