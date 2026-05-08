import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoGridOutline, IoCubeOutline, IoReceiptOutline, IoPeopleOutline, IoAddOutline, IoTrashOutline, IoPencilOutline, IoSearchOutline } from 'react-icons/io5';
import { adminApi } from '../../api/adminApi';
import { formatPrice } from '../../utils/formatPrice';
import Modal from '../../components/common/Modal';
import { CATEGORIES, BRANDS, GENDERS } from '../../utils/constants';
import toast from 'react-hot-toast';

const sidebar = [
  { to: '/admin', icon: IoGridOutline, label: 'Dashboard' },
  { to: '/admin/products', icon: IoCubeOutline, label: 'Products', active: true },
  { to: '/admin/orders', icon: IoReceiptOutline, label: 'Orders' },
  { to: '/admin/users', icon: IoPeopleOutline, label: 'Users' },
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProd, setEditProd] = useState(null);
  const [form, setForm] = useState({ name:'',brand:BRANDS[0],category:CATEGORIES[0].slug,gender:'Men',price:'',discountPercent:0,description:'',stock:10 });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try { const r = await adminApi.getProducts({}); setProducts(r.data?.content||r.data||[]); }
    catch { setProducts(Array.from({length:8},(_,i)=>({id:`p-${i}`,name:`Product ${i+1}`,brand:BRANDS[i%BRANDS.length],price:1000+i*300,discountPercent:[10,20,15,25,30,0,10,20][i],stock:10+i*5,category:CATEGORIES[i%CATEGORIES.length].slug,gender:i%2===0?'Men':'Women',images:[`https://picsum.photos/seed/${i+700}/40/50`]}))); }
  };

  const handleSave = async () => {
    if (!form.name||!form.price) { toast.error('Name and price are required'); return; }
    try { editProd ? await adminApi.updateProduct(editProd.id,form) : await adminApi.addProduct(form); } catch {}
    toast.success(editProd?'Updated!':'Added!'); setShowForm(false); setEditProd(null); fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await adminApi.deleteProduct(id); } catch {}
    setProducts(products.filter(p=>p.id!==id)); toast.success('Deleted');
  };

  return (
    <div style={{display:'flex',minHeight:'calc(100vh - 68px)'}}>
      <div className="admin-sidebar" style={{width:240,background:'var(--color-surface)',borderRight:'1px solid var(--color-border)',padding:16,flexShrink:0}}>
        <h3 style={{fontSize:14,fontWeight:700,color:'var(--color-text-muted)',textTransform:'uppercase',letterSpacing:1,padding:'12px 16px'}}>Admin Panel</h3>
        {sidebar.map(i=><Link key={i.to} to={i.to} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRadius:'var(--radius-sm)',fontSize:14,fontWeight:i.active?700:500,background:i.active?'rgba(108,92,231,0.1)':'none',color:i.active?'var(--color-primary)':'var(--color-text-secondary)',marginBottom:4}}><i.icon size={18}/>{i.label}</Link>)}
      </div>
      <div style={{flex:1,padding:32}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h1 style={{fontSize:28,fontWeight:800,fontFamily:'var(--font-display)'}}>Products</h1>
          <button onClick={()=>{setEditProd(null);setForm({name:'',brand:BRANDS[0],category:CATEGORIES[0].slug,gender:'Men',price:'',discountPercent:0,description:'',stock:10});setShowForm(true);}} className="btn btn-primary"><IoAddOutline size={18}/>Add Product</button>
        </div>
        <div className="card" style={{overflow:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'2px solid var(--color-border)'}}>
              {['Image','Name','Brand','Price','Discount','Stock','Actions'].map(h=><th key={h} style={{textAlign:'left',padding:'14px 16px',fontSize:12,fontWeight:700,color:'var(--color-text-secondary)',textTransform:'uppercase'}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id} style={{borderBottom:'1px solid var(--color-border)'}}>
                  <td style={{padding:'12px 16px'}}><img src={p.images?.[0]||`https://picsum.photos/seed/${p.id}/40/50`} style={{width:40,height:50,objectFit:'cover',borderRadius:'var(--radius-sm)'}}/></td>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:600}}>{p.name}</td>
                  <td style={{padding:'12px 16px',fontSize:14}}>{p.brand}</td>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:600}}>{formatPrice(p.price)}</td>
                  <td style={{padding:'12px 16px'}}>{p.discountPercent>0?<span className="badge badge-accent">{p.discountPercent}%</span>:'—'}</td>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:600,color:p.stock<10?'var(--color-error)':'var(--color-success)'}}>{p.stock}</td>
                  <td style={{padding:'12px 16px'}}><div style={{display:'flex',gap:4}}>
                    <button onClick={()=>{setEditProd(p);setForm({name:p.name,brand:p.brand,category:p.category,gender:p.gender,price:p.price,discountPercent:p.discountPercent||0,description:p.description||'',stock:p.stock||0});setShowForm(true);}} style={{background:'none',color:'var(--color-primary)',padding:4}}><IoPencilOutline size={18}/></button>
                    <button onClick={()=>handleDelete(p.id)} style={{background:'none',color:'var(--color-error)',padding:4}}><IoTrashOutline size={18}/></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={showForm} onClose={()=>setShowForm(false)} title={editProd?'Edit Product':'Add Product'} size="lg">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[['name','Product Name','1/-1'],['brand','Brand'],['category','Category'],['gender','Gender'],['price','Price (₹)'],['discountPercent','Discount %'],['stock','Stock']].map(([k,l,gc])=>(
            <div key={k} style={gc?{gridColumn:gc}:{}}>
              <label style={{fontSize:13,fontWeight:600,color:'var(--color-text-secondary)',display:'block',marginBottom:4}}>{l}</label>
              {k==='brand'?<select value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="input-field">{BRANDS.map(b=><option key={b}>{b}</option>)}</select>
              :k==='category'?<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field">{CATEGORIES.map(c=><option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
              :k==='gender'?<select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} className="input-field">{GENDERS.map(g=><option key={g}>{g}</option>)}</select>
              :<input type={['price','discountPercent','stock'].includes(k)?'number':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="input-field"/>}
            </div>
          ))}
          <div style={{gridColumn:'1/-1'}}><label style={{fontSize:13,fontWeight:600,color:'var(--color-text-secondary)',display:'block',marginBottom:4}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="input-field" rows={3}/></div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:20,justifyContent:'flex-end'}}>
          <button onClick={()=>setShowForm(false)} className="btn btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">{editProd?'Update':'Add'} Product</button>
        </div>
      </Modal>
      <style>{`@media(max-width:768px){.admin-sidebar{display:none;}}`}</style>
    </div>
  );
};

export default AdminProducts;
