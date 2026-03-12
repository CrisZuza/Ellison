import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Scissors, GraduationCap, ShoppingBag, TrendingUp, Eye } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    masters: 0,
    services: 0,
    courses: 0,
    products: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, s, c, p] = await Promise.all([
          fetch('/api/admin/masters').then(r => r.json()),
          fetch('/api/admin/services').then(r => r.json()),
          fetch('/api/admin/courses').then(r => r.json()),
          fetch('/api/admin/products').then(r => r.json()),
        ]);
        setStats({
          masters: m.length,
          services: s.length,
          courses: c.length,
          products: p.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { name: 'Total Masters', value: stats.masters, icon: Users, color: 'text-blue-400' },
    { name: 'Services', value: stats.services, icon: Scissors, color: 'text-gold' },
    { name: 'Active Courses', value: stats.courses, icon: GraduationCap, color: 'text-emerald-400' },
    { name: 'Shop Products', value: stats.products, icon: ShoppingBag, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="luxury-card p-6 rounded-2xl border border-white/5 hover:border-gold/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                <card.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-white/20 group-hover:text-gold transition-colors" />
            </div>
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">{card.name}</h3>
            <p className="text-3xl font-serif text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="luxury-card p-8 rounded-2xl border border-white/5">
          <h3 className="font-serif text-xl tracking-widest uppercase mb-6 flex items-center gap-4">
            <Eye size={20} className="text-gold" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all">
              Add New Master
            </button>
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all">
              Create Service
            </button>
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all">
              Upload to Gallery
            </button>
            <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-black transition-all">
              Edit Translations
            </button>
          </div>
        </div>

        <div className="luxury-card p-8 rounded-2xl border border-white/5">
          <h3 className="font-serif text-xl tracking-widest uppercase mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/60">API Status</span>
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/60">Storage</span>
              <span className="text-[10px] uppercase tracking-widest text-white font-bold">Local JSON</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/60">Last Backup</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Never</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
