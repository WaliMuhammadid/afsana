
import React, { useState, useRef } from 'react';
import { Product, Order } from '../types';

interface CommandCenterProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onExit: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ products, orders, onAddProduct, onEditProduct, onUpdateOrderStatus, onExit }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '', price: '', category: 'Outerwear', description: '', images: ['', '', ''], colors: ['Obsidian'], sizes: ['S', 'M', 'L', 'XL']
  });

  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === 'VG2024') {
      setIsDecrypting(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setIsDecrypting(false);
      }, 1500);
    } else {
      try {
        alert("ACCESS DENIED: INVALID CRYPTO-KEY");
      } catch (e) {
        console.warn("ACCESS DENIED: INVALID CRYPTO-KEY");
      }
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = [...(formData.images || ['', '', ''])];
        newImages[index] = base64String;
        setFormData({ ...formData, images: newImages });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ title: '', price: '', category: 'Outerwear', description: '', images: ['', '', ''], colors: ['Obsidian'], sizes: ['S', 'M', 'L', 'XL'] });
    setIsAdding(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onEditProduct({ ...editingProduct, ...formData } as Product);
      setEditingProduct(null);
    } else {
      const product: Product = { ...formData as Product, id: `prod-${Date.now()}` };
      onAddProduct(product);
      setIsAdding(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <form onSubmit={handleLogin} className="relative z-10 w-full max-w-md p-8 glass border-rose-500/20 text-center">
          <div className="w-16 h-16 bg-rose-600 rounded-lg flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(225,29,72,0.4)]">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter mb-2 uppercase">Command Center</h2>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mb-8">Encrypted Merchant Portal</p>
          <div className="space-y-4">
            <input type="password" placeholder="ENTER ACCESS KEY" value={accessKey} onChange={(e) => setAccessKey(e.target.value.toUpperCase())} className="w-full bg-slate-900 border border-white/10 p-4 text-center font-mono text-sm tracking-[0.5em] focus:border-rose-500 focus:outline-none transition-all" />
            <button type="submit" disabled={isDecrypting} className="w-full py-4 bg-white text-black font-black text-xs tracking-[0.3em] uppercase hover:bg-rose-600 hover:text-white transition-all disabled:opacity-50">
              {isDecrypting ? 'Decrypting Protocol...' : 'Initiate Sequence'}
            </button>
          </div>
          <button onClick={onExit} className="mt-8 text-[9px] font-bold text-slate-600 hover:text-white tracking-widest uppercase transition-colors">Abort Mission</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-[0.4em] text-green-500 uppercase">Vault Live: {orders.length} ACTIVE ORDERS</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Operations Dashboard</h1>
          </div>
          <div className="flex gap-2 glass p-1 rounded-sm border-white/5 overflow-x-auto max-w-full">
            <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Inventory</button>
            <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-white text-black' : 'hover:bg-white/5'}`}>Incoming Orders</button>
            <button onClick={onExit} className="px-4 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="grid grid-cols-1 gap-8">
          {activeTab === 'inventory' && (
            <div className="reveal-up">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black italic uppercase tracking-tight">Active Collection ({products.length})</h3>
                <button onClick={handleOpenAdd} className="bg-rose-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:scale-105 transition-transform">+ Deploy New Product</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item, i) => (
                  <div key={item.id} className="glass border-white/5 p-6 relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-16 bg-slate-900 rounded-sm overflow-hidden shrink-0">
                        <img src={item.images[0]} className="w-full h-full object-cover grayscale" alt="" />
                      </div>
                      <span className="text-[7px] font-bold opacity-30 font-mono">#{item.id.slice(-5)}</span>
                    </div>
                    <h4 className="font-black italic uppercase text-sm mb-1 truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">{item.category}</p>
                    <div className="flex justify-between items-end">
                      <span className="text-xl font-light font-mono text-rose-500">{item.price}</span>
                      <button onClick={() => handleOpenEdit(item)} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 underline transition-colors">Edit Meta</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="reveal-up space-y-6">
              <h3 className="text-xl font-black italic uppercase tracking-tight">Live Fulfillment Stream</h3>
              {orders.length === 0 ? (
                <div className="glass p-20 text-center border-white/5 opacity-50">
                  <p className="text-[10px] font-black uppercase tracking-widest italic">No pending requests in the stream.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="glass border-white/10 p-6 flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/3">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`h-2 w-2 rounded-full ${order.status === 'Pending' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.id}</span>
                        </div>
                        <h4 className="text-lg font-black italic uppercase mb-2">{order.customer.name}</h4>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest space-y-1">
                          <p>{order.customer.email}</p>
                          <p>{order.customer.address}, {order.customer.city}</p>
                          <p>{order.customer.postalCode}</p>
                        </div>
                      </div>
                      
                      <div className="lg:w-1/3 glass bg-white/5 p-4 rounded-sm">
                        <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-3">Manifest</p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[10px] font-bold">
                              <span>{item.quantity}x {item.product.title} ({item.selectedSize})</span>
                              <span className="text-slate-500">{item.product.price}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex justify-between font-black">
                          <span className="text-[10px] uppercase">COD Total</span>
                          <span className="text-white">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="lg:w-1/3 flex flex-col justify-between">
                        <div className="flex gap-2">
                          <button onClick={() => onUpdateOrderStatus(order.id, 'Shipped')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${order.status === 'Shipped' ? 'bg-green-500 text-white' : 'glass hover:bg-white hover:text-black'}`}>Mark Shipped</button>
                          <button onClick={() => onUpdateOrderStatus(order.id, 'Delivered')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${order.status === 'Delivered' ? 'bg-green-500 text-white' : 'glass hover:bg-white hover:text-black'}`}>Delivered</button>
                        </div>
                        <div className="text-[9px] font-bold text-slate-600 text-right uppercase tracking-widest mt-4 lg:mt-0">
                          Order Recieved: {new Date(order.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal (Handles Add and Edit) */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="glass p-8 w-full max-w-4xl border-rose-500/30 overflow-y-auto max-h-[90vh] reveal-up">
            <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-8">
              {editingProduct ? 'Update Product Meta' : 'Product Deployment Protocol'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Internal Title</span>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none transition-all" placeholder="e.g. HEAVY COTTON HOODIE" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Price Unit</span>
                    <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none" placeholder="$0.00" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Category</span>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none h-[50px]">
                      <option>Outerwear</option><option>Essentials</option><option>Smart Casual</option><option>Streetwear</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Asset Description</span>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 text-xs tracking-widest focus:border-rose-500 outline-none h-32 leading-relaxed" placeholder="Brief design details..." />
                </label>
              </div>
              <div className="space-y-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Visual Assets (Local Upload)</span>
                <div className="grid grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div 
                        onClick={() => fileInputRefs[i].current?.click()}
                        className="aspect-3/4 bg-slate-900 border-2 border-dashed border-white/10 rounded-sm flex items-center justify-center cursor-pointer hover:border-rose-500 transition-colors overflow-hidden relative group"
                      >
                        {formData.images?.[i] ? (
                          <>
                            <img src={formData.images[i]} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="text-[8px] font-black uppercase">Change</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-rose-500">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                             <span className="text-[8px] font-black uppercase">Slot 0{i+1}</span>
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRefs[i]} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(i, e)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-dashed border-white/10 rounded-sm bg-white/5">
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-normal">
                    * Select local assets for deployment. Images are processed into encrypted strings for vault storage. Max 3 slots per product.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-10 pt-8 border-t border-white/5">
              <button type="submit" className="flex-1 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all transform active:scale-95">
                {editingProduct ? 'Overwrite Metadata' : 'Authenticate & Deploy'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingProduct(null); }} className="px-10 py-5 glass border-white/10 text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-500/10 transition-all">
                Abort Protocol
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
