import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Save, ShoppingBag, Package, DollarSign } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Product } from '../types';

export const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const method = editingProduct.id ? 'PUT' : 'POST';
    const url = editingProduct.id ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product || {
      id: '',
      name: { ro: '', ru: '' },
      description: { ro: '', ru: '' },
      price: 0,
      image: '',
      images: [],
      category: 'Skincare'
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold transition-all"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="luxury-button-filled flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter(p => p.name.ro.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
          <motion.div 
            layout
            key={product.id}
            className="luxury-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={product.image} alt={product.name.ro} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg tracking-wider text-white truncate">{product.name.ro}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{product.price} MDL</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{product.category}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] uppercase tracking-widest text-white/40">
                  {product.category}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal(product)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-luxury-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/50">
                <h2 className="font-serif text-2xl tracking-widest uppercase">
                  {editingProduct.id ? 'Edit Product' : 'New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Product Photos</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {editingProduct.image && (
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={editingProduct.image} alt="Product" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/60 hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {(editingProduct.images || []).map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={photo} alt="Product" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, images: (editingProduct.images || []).filter((_, i) => i !== idx) })}
                          className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white/60 hover:text-red-400"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <ImageUpload 
                      label="Add Photo"
                      onUpload={(paths) => {
                        if (!editingProduct.image) {
                          setEditingProduct({ ...editingProduct, image: paths.original });
                        } else {
                          setEditingProduct({ ...editingProduct, images: [...(editingProduct.images || []), paths.original] });
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RO)</label>
                    <input 
                      type="text"
                      required
                      value={editingProduct.name.ro}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, ro: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RU)</label>
                    <input 
                      type="text"
                      required
                      value={editingProduct.name.ru}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: { ...editingProduct.name, ru: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Price (MDL)</label>
                    <input 
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Category</label>
                    <select 
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                    >
                      <option value="Skincare">Skincare</option>
                      <option value="Makeup">Makeup</option>
                      <option value="Haircare">Haircare</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Description (RO)</label>
                    <textarea 
                      rows={4}
                      value={editingProduct.description?.ro || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, ro: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Description (RU)</label>
                    <textarea 
                      rows={4}
                      value={editingProduct.description?.ru || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: { ...editingProduct.description, ru: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </form>

              <div className="p-8 border-t border-white/10 bg-black/50 flex justify-end gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="luxury-button-filled flex items-center gap-2"
                >
                  <Save size={18} />
                  <span>Save Product</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
