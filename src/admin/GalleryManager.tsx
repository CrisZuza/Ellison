import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, X, Image as ImageIcon, Grid, List } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { GalleryItem } from '../types';

export const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setItems(data.sort((a: any, b: any) => a.order - b.order));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (paths: any) => {
    const newItem = {
      url: paths.original,
      category: 'General',
      order: items.length
    };

    try {
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl tracking-widest uppercase">Gallery Collection</h2>
        <div className="flex gap-4">
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-gold transition-all">
            <Grid size={18} />
          </button>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-gold transition-all">
            <List size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div className="aspect-square">
          <ImageUpload 
            label="Add to Gallery"
            onUpload={handleUpload}
          />
        </div>

        {items.map((item, idx) => (
          <motion.div 
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-black"
          >
            <img src={item.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 rounded-full bg-red-500/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[8px] uppercase tracking-widest text-white/60 border border-white/10">
                {item.category}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
