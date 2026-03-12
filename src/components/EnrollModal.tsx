import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Course, Locale } from '../types';

interface EnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: Course;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({ isOpen, onClose, selectedCourse }) => {
  const { t, lang } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    courseId: selectedCourse?.id || '',
    language: (lang.toUpperCase() as Locale) || 'RO',
    startDate: '',
    name: '',
    phone: '',
    instagram: ''
  });

  useEffect(() => {
    if (selectedCourse) {
      setFormData(prev => ({ 
        ...prev, 
        courseId: selectedCourse.id,
        startDate: selectedCourse.nextStartDates[0] || ''
      }));
    }
  }, [selectedCourse]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const currentLocale = lang.toUpperCase() as Locale;
    const courseTitle = selectedCourse?.name[currentLocale] || formData.courseId;

    try {
      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course: courseTitle,
          language: formData.language
        }),
      });

      if (!response.ok) throw new Error('Failed to send enrollment');

      setStep(5); // Success step
      setTimeout(() => {
        onClose();
        setStep(1);
        setIsSending(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setError(t.booking.error);
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSending) onClose();
  };

  const currentLocale = lang.toUpperCase() as Locale;

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
          <h2 className="text-4xl font-serif text-white tracking-widest uppercase">
            {step === 1 && t.courses.enroll}
            {step === 2 && t.courses.language}
            {step === 3 && t.courses.nextStarts}
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
              <p className="text-white/60 text-sm tracking-widest uppercase">{t.courses.details}</p>
              <div className="p-6 rounded-2xl border border-gold bg-gold/10">
                <h3 className="text-white font-serif text-2xl mb-2">{selectedCourse?.name[currentLocale]}</h3>
                <p className="text-gold font-bold">{selectedCourse?.price} MDL</p>
              </div>
              <button 
                type="button" 
                onClick={handleNext}
                className="luxury-button-filled group w-full"
              >
                <span className="relative z-10">{t.booking.next}</span>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {['RO', 'RU'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => { setFormData({ ...formData, language: l as Locale }); handleNext(); }}
                    className={`p-6 rounded-2xl border text-center transition-all ${formData.language === l ? 'border-gold bg-gold/10 text-white' : 'border-white/5 bg-white/5 text-white/40 hover:border-white/20'}`}
                  >
                    <span className="text-xl font-serif tracking-widest">{l === 'RO' ? 'ROMÂNĂ' : 'РУССКИЙ'}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleBack} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">{t.booking.back}</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {selectedCourse?.nextStartDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => { setFormData({ ...formData, startDate: date }); handleNext(); }}
                    className={`p-6 rounded-2xl border text-left transition-all flex justify-between items-center ${formData.startDate === date ? 'border-gold bg-gold/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                  >
                    <span className="text-white font-serif tracking-widest">{date}</span>
                    <ChevronRight size={16} className="text-gold" />
                  </button>
                ))}
              </div>
              <button type="button" onClick={handleBack} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white">{t.booking.back}</button>
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
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2 block font-bold">Instagram (Optional)</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors text-white"
                    value={formData.instagram}
                    onChange={e => setFormData({...formData, instagram: e.target.value})}
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
              <p className="text-white/60 leading-relaxed max-w-xs mx-auto uppercase tracking-widest text-sm">{t.booking.success}</p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};
