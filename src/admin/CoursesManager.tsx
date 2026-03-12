import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Save, GraduationCap, Clock, Banknote } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { Course, Master } from '../types';

export const CoursesManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [c, m] = await Promise.all([
        fetch('/api/admin/courses').then(r => r.json()),
        fetch('/api/admin/masters').then(r => r.json()),
      ]);
      setCourses(c);
      setMasters(m);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    const method = editingCourse.id ? 'PUT' : 'POST';
    const url = editingCourse.id ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse),
      });
      if (res.ok) {
        fetchData();
        setIsModalOpen(false);
        setEditingCourse(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (course: Course | null = null) => {
    setEditingCourse(course || {
      id: '',
      name: { ro: '', ru: '' },
      subtitle: { ro: '', ru: '' },
      overview: { ro: '', ru: '' },
      curriculum: { ro: [], ru: [] },
      whatYouLearn: { ro: [], ru: [] },
      whoIsFor: { ro: [], ru: [] },
      price: 0,
      duration: '',
      image: '',
      masters: [],
      nextStartDates: [],
      contact: { phone: '', instagram: '' },
      category: 'Academy',
      level: 'Beginner',
      certificate: true
    });
    setIsModalOpen(true);
  };

  const addListItem = (field: 'curriculum' | 'whatYouLearn' | 'whoIsFor', lang: 'ro' | 'ru') => {
    if (!editingCourse) return;
    const currentList = editingCourse[field] || { ro: [], ru: [] };
    const newList = { ...currentList };
    newList[lang] = [...newList[lang], ''];
    setEditingCourse({ ...editingCourse, [field]: newList });
  };

  const updateListItem = (field: 'curriculum' | 'whatYouLearn' | 'whoIsFor', lang: 'ro' | 'ru', idx: number, val: string) => {
    if (!editingCourse) return;
    const currentList = editingCourse[field] || { ro: [], ru: [] };
    const newList = { ...currentList };
    newList[lang][idx] = val;
    setEditingCourse({ ...editingCourse, [field]: newList });
  };

  const removeListItem = (field: 'curriculum' | 'whatYouLearn' | 'whoIsFor', lang: 'ro' | 'ru', idx: number) => {
    if (!editingCourse) return;
    const currentList = editingCourse[field] || { ro: [], ru: [] };
    const newList = { ...currentList };
    newList[lang] = newList[lang].filter((_, i) => i !== idx);
    setEditingCourse({ ...editingCourse, [field]: newList });
  };

  const addDate = () => {
    if (!editingCourse) return;
    const nextStartDates = editingCourse.nextStartDates || [];
    setEditingCourse({ ...editingCourse, nextStartDates: [...nextStartDates, ''] });
  };

  const updateDate = (idx: number, val: string) => {
    if (!editingCourse) return;
    const nextStartDates = [...(editingCourse.nextStartDates || [])];
    nextStartDates[idx] = val;
    setEditingCourse({ ...editingCourse, nextStartDates });
  };

  const removeDate = (idx: number) => {
    if (!editingCourse) return;
    const nextStartDates = (editingCourse.nextStartDates || []).filter((_, i) => i !== idx);
    setEditingCourse({ ...editingCourse, nextStartDates });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold transition-all"
          />
        </div>
        <button 
          onClick={() => openModal()}
          className="luxury-button-filled flex items-center gap-2"
        >
          <GraduationCap size={18} />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.filter(c => c.name.ro.toLowerCase().includes(searchTerm.toLowerCase())).map((course) => (
          <motion.div 
            layout
            key={course.id}
            className="luxury-card p-6 rounded-2xl border border-white/5 group relative overflow-hidden"
          >
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={course.image} alt={course.name.ro} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg tracking-wider text-white truncate">{course.name.ro}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">{course.price} MDL</p>
                <p className="text-[8px] uppercase tracking-widest text-white/40 mt-1">{course.duration}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-white/5 text-[8px] uppercase tracking-widest text-white/40">
                  {course.masters.length} Instructors
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal(course)}
                  className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-gold hover:bg-gold/10 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
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
        {isModalOpen && editingCourse && (
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
              className="relative w-full max-w-5xl bg-luxury-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/50">
                <h2 className="font-serif text-2xl tracking-widest uppercase">
                  {editingCourse.id ? 'Edit Course' : 'New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <ImageUpload 
                      label="Course Photo"
                      currentImage={editingCourse.image}
                      onUpload={(paths) => setEditingCourse({ ...editingCourse, image: paths.original })}
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RO)</label>
                        <input 
                          type="text"
                          required
                          value={editingCourse.name.ro}
                          onChange={(e) => setEditingCourse({ ...editingCourse, name: { ...editingCourse.name, ro: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Name (RU)</label>
                        <input 
                          type="text"
                          required
                          value={editingCourse.name.ru}
                          onChange={(e) => setEditingCourse({ ...editingCourse, name: { ...editingCourse.name, ru: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Subtitle (RO)</label>
                        <input 
                          type="text"
                          value={editingCourse.subtitle.ro}
                          onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: { ...editingCourse.subtitle, ro: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Subtitle (RU)</label>
                        <input 
                          type="text"
                          value={editingCourse.subtitle.ru}
                          onChange={(e) => setEditingCourse({ ...editingCourse, subtitle: { ...editingCourse.subtitle, ru: e.target.value } })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Price (MDL)</label>
                        <input 
                          type="number"
                          required
                          value={editingCourse.price}
                          onChange={(e) => setEditingCourse({ ...editingCourse, price: parseInt(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Duration</label>
                        <input 
                          type="text"
                          required
                          value={editingCourse.duration}
                          onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          placeholder="e.g. 3 Days"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Category</label>
                        <input 
                          type="text"
                          value={editingCourse.category}
                          onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Level</label>
                        <input 
                          type="text"
                          value={editingCourse.level}
                          onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Certificate</label>
                        <select 
                          value={editingCourse.certificate ? 'true' : 'false'}
                          onChange={(e) => setEditingCourse({ ...editingCourse, certificate: e.target.value === 'true' })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm appearance-none"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Overview (RO)</label>
                    <textarea 
                      rows={4}
                      value={editingCourse.overview.ro}
                      onChange={(e) => setEditingCourse({ ...editingCourse, overview: { ...editingCourse.overview, ro: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Overview (RU)</label>
                    <textarea 
                      rows={4}
                      value={editingCourse.overview.ru}
                      onChange={(e) => setEditingCourse({ ...editingCourse, overview: { ...editingCourse.overview, ru: e.target.value } })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Curriculum (RO)</label>
                      <button type="button" onClick={() => addListItem('curriculum', 'ro')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.curriculum.ro.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('curriculum', 'ro', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('curriculum', 'ro', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Curriculum (RU)</label>
                      <button type="button" onClick={() => addListItem('curriculum', 'ru')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.curriculum.ru.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('curriculum', 'ru', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('curriculum', 'ru', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">What You Learn (RO)</label>
                      <button type="button" onClick={() => addListItem('whatYouLearn', 'ro')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.whatYouLearn?.ro.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('whatYouLearn', 'ro', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('whatYouLearn', 'ro', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">What You Learn (RU)</label>
                      <button type="button" onClick={() => addListItem('whatYouLearn', 'ru')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.whatYouLearn?.ru.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('whatYouLearn', 'ru', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('whatYouLearn', 'ru', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Who Is It For (RO)</label>
                      <button type="button" onClick={() => addListItem('whoIsFor', 'ro')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.whoIsFor?.ro.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('whoIsFor', 'ro', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('whoIsFor', 'ro', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Who Is It For (RU)</label>
                      <button type="button" onClick={() => addListItem('whoIsFor', 'ru')} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.whoIsFor?.ru.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={item}
                            onChange={(e) => updateListItem('whoIsFor', 'ru', idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                          />
                          <button type="button" onClick={() => removeListItem('whoIsFor', 'ru', idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Next Start Dates</label>
                      <button type="button" onClick={addDate} className="text-gold text-[10px] uppercase tracking-widest font-bold">+ Add Date</button>
                    </div>
                    <div className="space-y-2">
                      {editingCourse.nextStartDates?.map((date, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={date}
                            onChange={(e) => updateDate(idx, e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                            placeholder="e.g. 15 March 2025"
                          />
                          <button type="button" onClick={() => removeDate(idx)} className="p-3 text-white/20 hover:text-red-400"><X size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Contact Info</label>
                    <div className="space-y-4">
                      <input 
                        type="text"
                        placeholder="Phone Number"
                        value={editingCourse.contact?.phone}
                        onChange={(e) => setEditingCourse({ ...editingCourse, contact: { ...editingCourse.contact!, phone: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                      />
                      <input 
                        type="text"
                        placeholder="Instagram URL"
                        value={editingCourse.contact?.instagram}
                        onChange={(e) => setEditingCourse({ ...editingCourse, contact: { ...editingCourse.contact!, instagram: e.target.value } })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Instructors</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {masters.map(m => (
                      <label key={m.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${editingCourse.masters.includes(m.id) ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                        <input 
                          type="checkbox"
                          checked={editingCourse.masters.includes(m.id)}
                          onChange={(e) => {
                            const newMasters = e.target.checked 
                              ? [...editingCourse.masters, m.id]
                              : editingCourse.masters.filter(id => id !== m.id);
                            setEditingCourse({ ...editingCourse, masters: newMasters });
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
                  <span>Save Course</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
