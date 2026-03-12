import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Clock, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Instagram, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Course, Locale } from '../types';
import { EnrollModal } from '../components/EnrollModal';
import { Logo } from '../components/Logo';

export const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useTranslation();
  const { courses, isLoading } = useData();
  const navigate = useNavigate();
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);

  const course = courses.find(c => c.id === id);
  const currentLocale = lang.toUpperCase() as Locale;

  React.useEffect(() => {
    if (course) {
      document.title = `${course.name[lang]} — ÉLLISON BEAUTY ROOM`;
    }
  }, [course, lang]);

  if (!t || isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Logo className="animate-pulse opacity-20" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-serif text-white mb-8">Course not found</h2>
          <Link to="/courses" className="text-gold uppercase tracking-widest text-sm">Back to courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/courses" 
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-gold transition-colors mb-12 font-bold"
        >
          <ChevronLeft size={16} /> {t.courses.back}
        </Link>
 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">{course.category || 'Academy'}</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 uppercase tracking-widest leading-tight">
              {course.name[lang]}
            </h1>
            <p className="text-xl text-white/60 mb-12 font-light leading-relaxed uppercase tracking-widest">
              {course.subtitle[lang]}
            </p>
 
            <div className="grid grid-cols-3 gap-8 mb-16 border-y border-white/5 py-10">
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">{t.courses.duration}</p>
                <p className="text-white font-serif text-xl gold-text">{course.duration}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">{t.courses.level}</p>
                <p className="text-white font-serif text-xl uppercase gold-text">{course.level || 'Beginner'}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-bold">{t.courses.price}</p>
                <p className="text-white font-serif text-xl gold-text">{course.price} MDL</p>
              </div>
            </div>
 
            <div className="space-y-16">
              {/* Overview */}
              <div>
                <h3 className="text-2xl font-serif text-white mb-6 uppercase tracking-widest">{t.courses.details}</h3>
                <p className="text-white/60 leading-relaxed text-lg font-light">
                  {course.overview[lang]}
                </p>
              </div>
 
              {/* What You Learn */}
              {course.whatYouLearn && (
                <div>
                  <h3 className="text-2xl font-serif text-white mb-8 uppercase tracking-widest">{t.courses.learn}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.whatYouLearn[lang].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <CheckCircle2 size={18} className="text-gold shrink-0" />
                        <span className="text-white/80 text-sm uppercase tracking-widest">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
 
              {/* Curriculum */}
              <div>
                <h3 className="text-2xl font-serif text-white mb-8 uppercase tracking-widest">{t.courses.curriculum}</h3>
                <div className="space-y-4">
                  {course.curriculum[lang].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
                      <p className="text-white/80 leading-relaxed uppercase tracking-widest text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Who is it for */}
              {course.whoIsFor && (
                <div>
                  <h3 className="text-2xl font-serif text-white mb-6 uppercase tracking-widest">{t.courses.who}</h3>
                  <ul className="space-y-4">
                    {course.whoIsFor[lang].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-4 text-white/60 uppercase tracking-widest text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
 
          {/* Right Column: Sticky Info Panel */}
          <div className="lg:sticky lg:top-40 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="luxury-card rounded-2xl p-10 luxury-shadow"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-10 border border-white/5">
                <img 
                  src={course.image} 
                  alt={course.name[lang]} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
 
              <div className="space-y-10">
                {course.nextStartDates && course.nextStartDates.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 font-bold">{t.courses.nextStarts}</h4>
                    <div className="flex flex-wrap gap-3">
                      {course.nextStartDates.map(date => (
                        <div key={date} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-widest">
                          {date}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
 
                <div className="pt-10 border-t border-white/5">
                  <button 
                    onClick={() => setIsEnrollOpen(true)}
                    className="w-full luxury-button-filled group flex items-center justify-center gap-4"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      {t.courses.enroll} <ArrowRight size={16} />
                    </span>
                  </button>
                </div>
 
                {course.contact && (
                  <div className="pt-10 border-t border-white/5">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 font-bold">{t.courses.contact}</h4>
                    <div className="flex flex-col gap-4">
                      <a href={`tel:${course.contact.phone}`} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                        <Phone size={18} className="text-gold" />
                        <span className="text-sm tracking-widest font-bold">{course.contact.phone}</span>
                      </a>
                      {course.contact.instagram && (
                        <a href={course.contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                          <Instagram size={18} className="text-gold" />
                          <span className="text-sm tracking-widest font-bold">@ellisonbeautyroom</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <EnrollModal 
        isOpen={isEnrollOpen} 
        onClose={() => setIsEnrollOpen(false)} 
        selectedCourse={course}
      />
    </div>
  );
};
