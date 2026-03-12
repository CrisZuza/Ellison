import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Save, Scissors } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Service } from '../types';

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, m] = await Promise.all([
        fetch('/api/admin/services').then(r => r.json()),
        fetch('/api/admin/masters').then(r => r.json()),
      ]);
      setServices(s);
      setMasters(m);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const method = editingService.id ? 'PUT' : 'POST';
    const url = editingService.id ? `/api/admin/services/${editingService.id}` : '/api/admin/services';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingService(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (service: Service | null = null) => {
    setEditingService(service || {
      id: '',
      name: { ro: '', ru: '' },
      description: { ro: '', ru: '' },
      price: 0,
      duration: '60 min',
      image: '',
      category: 'General',
      masters: []
    });
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(s => 
    s.name.ro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold transition-all"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="luxury-button-filled flex items-center gap-2"
        >
          <Scissors size={18} />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <motion.div 
            layout
            key={service.id}
            className="luxury-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={service.image} alt={service.name.ro} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg tracking-wider text-white truncate">{service.name.ro}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{service.price} MDL</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{service.category}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] uppercase tracking-widest text-white/40">
                  {service.masters?.length || 0} Masters
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal(service)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
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
        {isModalOpen && editingService && (
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
                  {editingService.id ? 'Edit Service' : 'New Service'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <ImageUpload 
                      label="Service Photo"
                      currentImage={editingService.image}
                      onUpload={(paths) => setEditingService({ ...editingService, image: paths.original })}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RO)</label>
                        <input 
                          type="text"
                          required
                          value={editingService.name.ro}
                          onChange={(e) => setEditingService({ ...editingService, name: { ...editingService.name, ro: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RU)</label>
                        <input 
                          type="text"
                          required
                          value={editingService.name.ru}
                          onChange={(e) => setEditingService({ ...editingService, name: { ...editingService.name, ru: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Price (MDL)</label>
                        <input 
                          type="number"
                          required
                          value={editingService.price}
                          onChange={(e) => setEditingService({ ...editingService, price: parseInt(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Duration</label>
                        <input 
                          type="text"
                          required
                          value={editingService.duration}
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          placeholder="e.g. 60 min"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Category</label>
                        <select 
                          value={editingService.category}
                          onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        >
                          <option value="General">General</option>
                          <option value="Face">Face</option>
                          <option value="Body">Body</option>
                          <option value="Nails">Nails</option>
                          <option value="Hair">Hair</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Description (RO)</label>
                    <textarea 
                      rows={4}
                      value={editingService.description?.ro || ''}
                      onChange={(e) => setEditingService({ ...editingService, description: { ...editingService.description, ro: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Description (RU)</label>
                    <textarea 
                      rows={4}
                      value={editingService.description?.ru || ''}
                      onChange={(e) => setEditingService({ ...editingService, description: { ...editingService.description, ru: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Assigned Masters</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {masters.map(m => (
                      <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${editingService.masters?.includes(m.id) ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                        <input 
                          type="checkbox"
                          checked={editingService.masters?.includes(m.id)}
                          onChange={(e) => {
                            const newMasters = e.target.checked 
                              ? [...(editingService.masters || []), m.id]
                              : (editingService.masters || []).filter(id => id !== m.id);
                            setEditingService({ ...editingService, masters: newMasters });
                          }}
                          className="hidden"
                        />
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                          <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold truncate">{m.name}</span>
                      </label>
                    ))}
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
                  <span>Save Service</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
