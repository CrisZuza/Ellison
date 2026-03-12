import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, Clock, Instagram, Send, Settings as SettingsIcon } from 'lucide-react';

export const SettingsManager = () => {
  const [settings, setSettings] = useState<any>({
    phone: '',
    email: '',
    address: { ro: '', ru: '' },
    hours: { ro: '', ru: '' },
    social: {
      instagram: '',
      telegram: '',
      facebook: ''
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data && data.length > 0) {
        setSettings(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = settings.id ? 'PUT' : 'POST';
      const url = settings.id ? `/api/admin/settings/${settings.id}` : '/api/admin/settings';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl tracking-widest uppercase">Salon Configuration</h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="luxury-button-filled flex items-center gap-2"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="luxury-card p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-2">
            <Phone size={14} />
            Contact Information
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Phone Number</label>
              <input 
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Email Address</label>
              <input 
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="luxury-card p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-2">
            <Instagram size={14} />
            Social Media
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Instagram</label>
              <input 
                type="text"
                value={settings.social.instagram}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Telegram</label>
              <input 
                type="text"
                value={settings.social.telegram}
                onChange={(e) => setSettings({ ...settings, social: { ...settings.social, telegram: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="luxury-card p-8 rounded-2xl border border-white/5 space-y-6 md:col-span-2">
          <h3 className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-2">
            <MapPin size={14} />
            Location & Hours
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Address (RO)</label>
                <input 
                  type="text"
                  value={settings.address.ro}
                  onChange={(e) => setSettings({ ...settings, address: { ...settings.address, ro: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Address (RU)</label>
                <input 
                  type="text"
                  value={settings.address.ru}
                  onChange={(e) => setSettings({ ...settings, address: { ...settings.address, ru: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Working Hours (RO)</label>
                <input 
                  type="text"
                  value={settings.hours.ro}
                  onChange={(e) => setSettings({ ...settings, hours: { ...settings.hours, ro: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">Working Hours (RU)</label>
                <input 
                  type="text"
                  value={settings.hours.ru}
                  onChange={(e) => setSettings({ ...settings, hours: { ...settings.hours, ru: e.target.value } })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-gold transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
