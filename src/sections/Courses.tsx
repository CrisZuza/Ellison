import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Course, Locale } from '../types';
import { Logo } from '../components/Logo';

export const Courses: React.FC = () => {
  const { t, lang } = useTranslation();
  const { courses, isLoading } = useData();
  const currentLocale = lang.toUpperCase() as Locale;

  React.useEffect(() => {
    if (t) {
      document.title = lang === 'ro' 
        ? "Cursuri de frumusețe ÉLLISON — Manichiură, Pedichiură, Laminare Sprâncene & Gene"
        : "Курсы красоты ÉLLISON — Маникюр, Педикюр, Ламинирование бровей и ресниц";
    }
  }, [lang, t]);

  if (!t || isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Logo className="animate-pulse opacity-20" />
      </div>
    );
  }

  return (
    <section id="courses" className="py-32 bg-black min-h-screen pt-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Academy</span>
            <h2 className="text-6xl md:text-8xl font-serif text-white mb-8 uppercase tracking-widest">{t.courses.pageTitle}</h2>
            <p className="text-white/40 max-w-2xl mx-auto text-sm uppercase tracking-[0.2em] leading-relaxed">
              {t.courses.intro}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative luxury-card rounded-2xl overflow-hidden"
            >
              <div className="aspect-[16/9] overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.name[lang]} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-gold/20">
                    {course.level || 'Beginner'}
                  </span>
                </div>
              </div>

              <div className="p-10">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-4 group-hover:gold-text transition-colors uppercase tracking-widest leading-tight">
                  {course.name[lang]}
                </h3>
                <p className="text-white/40 text-sm mb-10 line-clamp-2 uppercase tracking-widest leading-relaxed">
                  {course.subtitle[lang]}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10 border-y border-white/5 py-8">
                  <div className="flex items-center gap-4">
                    <Clock size={18} className="text-gold" />
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">{t.courses.duration}</p>
                      <p className="text-white text-xs font-bold uppercase tracking-widest">{course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Award size={18} className="text-gold" />
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">{t.courses.certificate}</p>
                      <p className="text-white text-xs font-bold uppercase tracking-widest">{course.certificate ? 'YES' : 'NO'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-serif text-white tracking-widest">{course.price} MDL</p>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="luxury-button group inline-flex items-center gap-3"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      {t.courses.details} <ChevronRight size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
