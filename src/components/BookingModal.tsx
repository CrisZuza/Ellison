import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Service, Master } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedService }) => {
  const { t, lang } = useTranslation();
  const { masters, services } = useData();
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: selectedService?.id || '',
    master: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({ ...prev, service: selectedService.id }));
    }
  }, [selectedService]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const selectedServiceName = services.find(s => s.id === formData.service)?.name[lang] || formData.service;
    const selectedMasterName = masters.find(m => m.id === formData.master)?.name || formData.master;

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service: selectedServiceName,
          master: selectedMasterName,
          language: lang.toUpperCase()
        }),
      });

      if (!response.ok) throw new Error('Failed to send booking');

      setStep(5); // Success step
      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({ name: '', phone: '', service: '', master: '', date: '', time: '' });
        setIsSending(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setError(t?.booking.error || 'Error');
      setIsSending(false);
    }
  };

  if (!isOpen || !t) return null;

  const handleClose = () => {
    if (!isSending) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-luxury-black border border-white/10 w-full max-w-xl p-8 md:p-12 rounded-2xl luxury-shadow overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <button 
          onClick={handleClose} 
          disabled={isSending}
          className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors disabled:opacity-0"
        >
          <X size={24} />
        </button>

        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2 block font-bold">Step {step > 4 ? 4 : step} of 4</span>
          <h2 className="text-4xl font-serif text-white tracking-widest">
            {step === 1 && t.booking.step1}
            {step === 2 && t.booking.step2}
            {step === 3 && t.booking.step3}
            {step === 4 && t.booking.step4}
            {step === 5 && t.booking.success}
          </h2>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {services.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setFormData({ ...formData, service: s.id }); handleNext(); }}
                    className={`p-6 rounded-2xl border text-left transition-all flex justify-between items-center ${formData.service === s.id ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <p className="text-white font-serif text-lg">{s.name[lang]}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{s.duration}</p>
                    </div>
                    <p className="text-gold font-bold">{s.price} MDL</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {masters.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setFormData({ ...formData, master: m.id }); handleNext(); }}
                    className={`p-6 rounded-2xl border text-left transition-all flex items-center gap-4 ${formData.master === m.id ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <img src={m.image} alt={m.name} className="w-12 h-12 rounded-full object-cover grayscale" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-white font-serif">{m.name}</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{m.specialty[lang]}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleBack} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">{t.booking.back}</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 block font-bold">{t.booking.date}</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-gold"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4 block font-bold">{t.booking.time}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({ ...formData, time })}
                        className={`p-2 rounded-lg border text-[10px] transition-all ${formData.time === time ? 'border-gold bg-gold text-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button type="button" onClick={handleBack} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">{t.booking.back}</button>
                <button 
                  type="button" 
                  disabled={!formData.date || !formData.time}
                  onClick={handleNext}
                  className="luxury-button-filled group"
                >
                  <span className="relative z-10">{t.booking.next}</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block font-bold">{t.booking.name}</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors text-white"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block font-bold">{t.booking.phone}</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors text-white"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button type="button" onClick={handleBack} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">{t.booking.back}</button>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="luxury-button group"
                >
                  <span className="relative z-10 text-gold">
                    {isSending ? t.booking.sending : t.booking.submit}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="flex justify-center mb-8">
                <CheckCircle2 size={80} className="text-gold" />
              </div>
              <p className="text-white/60 leading-relaxed max-w-xs mx-auto">{t.booking.success}</p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};
