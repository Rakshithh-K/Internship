import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoGridOutline, IoCubeOutline, IoReceiptOutline, IoPeopleOutline } from 'react-icons/io5';
import { adminApi } from '../../api/adminApi';

const sidebar = [
  { to: '/admin', icon: IoGridOutline, label: 'Dashboard' },
  { to: '/admin/products', icon: IoCubeOutline, label: 'Products' },
  { to: '/admin/orders', icon: IoReceiptOutline, label: 'Orders' },
  { to: '/admin/users', icon: IoPeopleOutline, label: 'Users', active: true },
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try { const r = await adminApi.getUsers({}); setUsers(r.data?.content||r.data||[]); }
      catch { setUsers([
        { id:'1',firstName:'Rahul',lastName:'S.',email:'rahul@example.com',phone:'9876543210',role:'USER',createdAt:'2026-03-15' },
        { id:'2',firstName:'Priya',lastName:'M.',email:'priya@example.com',phone:'9876543211',role:'USER',createdAt:'2026-04-01' },
        { id:'3',firstName:'Admin',lastName:'User',email:'admin@stylesphere.com',phone:'9876543212',role:'ADMIN',createdAt:'2026-01-01' },
        { id:'4',firstName:'Sneha',lastName:'R.',email:'sneha@example.com',phone:'9876543213',role:'USER',createdAt:'2026-04-20' },
      ]); }
    };
    fetch();
  }, []);

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 68px)'}}>
      <div className="admin-sidebar" style={{width:240,background:'var(--color-surface)',borderRight:'1px solid var(--color-border)',padding:16,flexShrink:0}}>
        <h3 style={{fontSize:14,fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:1,padding:'12px 16px'}}>Admin Panel</h3>
        {sidebar.map(i=><Link key={i.to} to={i.to} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRadius:'var(--radius-sm)',fontSize:14,fontWeight:i.active?700:500,background:i.active?'rgba(108,92,231,0.1)':'none',color:i.active?'var(--color-primary)':'var(--color-text-secondary)',marginBottom:4}}><i.icon size={18}/>{i.label}</Link>)}
      </div>
      <div style={{flex:1,padding:32}}>
        <h1 style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)',marginBottom:24}}>Users</h1>
        <div className="card" style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid var(--color-border)'}}>
              {['Name','Email','Phone','Role','Joined'].map(h=><th key={h} style={{textAlign:'left',padding:'14px 16px',fontSize:12,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} style={{borderBottom:'1px solid var(--color-border)'}}>
                  <td style={{padding:'14px 16px'}}><div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--color-primary),var(--color-accent))',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>{u.firstName?.charAt(0)}</div>
                    <span style={{fontWeight:600,fontSize:14}}>{u.firstName} {u.lastName}</span>
                  </div></td>
                  <td style={{padding:'14px 16px',fontSize:14}}>{u.email}</td>
                  <td style={{padding:'14px 16px',fontSize:14}}>{u.phone}</td>
                  <td style={{padding:'14px 16px'}}><span className={`badge ${u.role==='ADMIN'?'badge-primary':'badge-success'}`}>{u.role}</span></td>
                  <td style={{padding:'14px 16px',fontSize:13,color:'var(--color-text-muted)'}}>{u.createdAt}</td>
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

export default AdminUsers;
