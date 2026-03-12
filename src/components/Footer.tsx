import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Logo } from './Logo';

export const Footer = () => {
  const { t } = useTranslation();
  const { settings } = useData();

  if (!t) return null;

  return (
    <footer className="bg-black text-white py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-16">
          <div className="flex justify-center md:justify-start">
            <Logo />
          </div>
          
          <div className="text-center">
            <Link 
              to="/courses#contact" 
              className="group inline-flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold group-hover:scale-110 transition-transform">
                Teach with ÉLLISON
              </span>
              <div className="h-px w-12 bg-gold/30 group-hover:w-24 transition-all" />
            </Link>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold text-center md:text-right">
              © {new Date().getFullYear()} ÉLLISON BEAUTY ROOM. {t.footer.rights}
            </p>
            <div className="flex gap-8 text-[8px] text-white/10 uppercase tracking-widest font-bold">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
