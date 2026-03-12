import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Search, Languages, Globe } from 'lucide-react';

export const TranslationsManager = () => {
  const [translations, setTranslations] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/translations');
      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translations),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateTranslation = (key: string, lang: 'ro' | 'ru', value: string) => {
    setTranslations({
      ...translations,
      [key]: {
        ...translations[key],
        [lang]: value
      }
    });
  };

  const filteredKeys = Object.keys(translations).filter(key => 
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translations[key].ro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translations[key].ru.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-gold transition-all"
          />
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="luxury-button-filled flex items-center gap-2"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      <div className="luxury-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 bg-black/50 p-4 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold text-white/40">
          <div className="col-span-4">Key / Identifier</div>
          <div className="col-span-4 flex items-center gap-2">
            <Globe size={12} className="text-gold" />
            Romanian (RO)
          </div>
          <div className="col-span-4 flex items-center gap-2">
            <Globe size={12} className="text-gold" />
            Russian (RU)
          </div>
        </div>

        <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
          {filteredKeys.map((key) => (
            <div key={key} className="grid grid-cols-12 p-4 gap-4 items-start hover:bg-white/5 transition-colors">
              <div className="col-span-4">
                <code className="text-[10px] text-gold/60 font-mono bg-gold/5 px-2 py-1 rounded">{key}</code>
              </div>
              <div className="col-span-4">
                <textarea 
                  value={translations[key].ro}
                  onChange={(e) => updateTranslation(key, 'ro', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-gold transition-all resize-none"
                  rows={2}
                />
              </div>
              <div className="col-span-4">
                <textarea 
                  value={translations[key].ru}
                  onChange={(e) => updateTranslation(key, 'ru', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white outline-none focus:border-gold transition-all resize-none"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
