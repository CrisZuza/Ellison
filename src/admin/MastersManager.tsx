import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Save, UserPlus, Instagram, MessageSquare } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Master } from '../types';

export const MastersManager = () => {
  const [masters, setMasters] = useState<Master[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [m, s, c] = await Promise.all([
        fetch('/api/admin/masters').then(r => r.json()),
        fetch('/api/admin/services').then(r => r.json()),
        fetch('/api/admin/courses').then(r => r.json()),
      ]);
      setMasters(m);
      setServices(s);
      setCourses(c);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaster) return;

    const method = editingMaster.id ? 'PUT' : 'POST';
    const url = editingMaster.id ? `/api/admin/masters/${editingMaster.id}` : '/api/admin/masters';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMaster),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingMaster(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this master?')) return;
    try {
      await fetch(`/api/admin/masters/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (master: Master | null = null) => {
    setEditingMaster(master || {
      id: '',
      name: '',
      specialty: { ro: '', ru: '' },
      bio: { ro: '', ru: '' },
      image: '',
      services: [],
      courses: []
    });
    setIsModalOpen(true);
  };

  const filteredMasters = masters.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search masters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold transition-all"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="luxury-button-filled flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Add New Master</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMasters.map((master) => (
          <motion.div 
            layout
            key={master.id}
            className="luxury-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={master.image} alt={master.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg tracking-wider text-white truncate">{master.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{master.specialty.ro}</p>
                <div className="flex gap-3 mt-3">
                  {master.instagram && <Instagram size={14} className="text-white/20" />}
                  {master.telegram && <MessageSquare size={14} className="text-white/20" />}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] uppercase tracking-widest text-white/40">
                  {master.services?.length || 0} Services
                </span>
                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] uppercase tracking-widest text-white/40">
                  {master.courses?.length || 0} Courses
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal(master)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(master.id)}
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
        {isModalOpen && editingMaster && (
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
                  {editingMaster.id ? 'Edit Master' : 'New Master'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <ImageUpload 
                      label="Profile Photo"
                      currentImage={editingMaster.image}
                      onUpload={(paths) => setEditingMaster({ ...editingMaster, image: paths.original })}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={editingMaster.name}
                        onChange={(e) => setEditingMaster({ ...editingMaster, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        placeholder="e.g. Elena Ellison"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Specialty (RO)</label>
                        <input 
                          type="text"
                          required
                          value={editingMaster.specialty.ro}
                          onChange={(e) => setEditingMaster({ ...editingMaster, specialty: { ...editingMaster.specialty, ro: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Specialty (RU)</label>
                        <input 
                          type="text"
                          required
                          value={editingMaster.specialty.ru}
                          onChange={(e) => setEditingMaster({ ...editingMaster, specialty: { ...editingMaster.specialty, ru: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Bio (RO)</label>
                    <textarea 
                      rows={4}
                      value={editingMaster.bio?.ro || ''}
                      onChange={(e) => setEditingMaster({ ...editingMaster, bio: { ...editingMaster.bio, ro: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Bio (RU)</label>
                    <textarea 
                      rows={4}
                      value={editingMaster.bio?.ru || ''}
                      onChange={(e) => setEditingMaster({ ...editingMaster, bio: { ...editingMaster.bio, ru: e.target.value } as any })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Instagram Link</label>
                    <input 
                      type="text"
                      value={editingMaster.instagram || ''}
                      onChange={(e) => setEditingMaster({ ...editingMaster, instagram: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Telegram Chat ID</label>
                    <input 
                      type="text"
                      value={editingMaster.telegram || ''}
                      onChange={(e) => setEditingMaster({ ...editingMaster, telegram: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                      placeholder="e.g. 123456789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Services</label>
                    <div className="max-h-40 overflow-y-auto border border-white/10 rounded-xl p-4 space-y-2 bg-black/20">
                      {services.map(s => (
                        <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={editingMaster.services?.includes(s.id)}
                            onChange={(e) => {
                              const newProcs = e.target.checked 
                                ? [...(editingMaster.services || []), s.id]
                                : (editingMaster.services || []).filter(id => id !== s.id);
                              setEditingMaster({ ...editingMaster, services: newProcs });
                            }}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
                          />
                          <span className="text-xs text-white/60 group-hover:text-white transition-colors">{s.name.ro}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Courses</label>
                    <div className="max-h-40 overflow-y-auto border border-white/10 rounded-xl p-4 space-y-2 bg-black/20">
                      {courses.map(c => (
                        <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={editingMaster.courses?.includes(c.id)}
                            onChange={(e) => {
                              const newCourses = e.target.checked 
                                ? [...(editingMaster.courses || []), c.id]
                                : (editingMaster.courses || []).filter(id => id !== c.id);
                              setEditingMaster({ ...editingMaster, courses: newCourses });
                            }}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-gold focus:ring-gold"
                          />
                          <span className="text-xs text-white/60 group-hover:text-white transition-colors">{c.name.ro}</span>
                        </label>
                      ))}
                    </div>
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
                  <span>Save Master</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
