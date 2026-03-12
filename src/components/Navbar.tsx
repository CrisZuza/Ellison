import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { Logo } from './Logo';

export const Navbar = () => {
  const { lang, setLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!t) return null;

  const isHome = location.pathname === '/';

  const navItems = [
    { name: t.nav.about, href: isHome ? '#about' : '/#about' },
    { name: t.nav.services, href: isHome ? '#services' : '/#services' },
    { name: t.nav.masters, href: isHome ? '#masters' : '/#masters' },
    { name: t.nav.gallery, href: isHome ? '#gallery' : '/#gallery' },
    { name: t.nav.products, href: isHome ? '#products' : '/#products' },
    { name: t.nav.courses, href: '/courses' },
    { name: t.nav.contact, href: isHome ? '#contact' : '/#contact' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('#') && isHome) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'luxury-blur py-4 luxury-shadow' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Link to="/" className="hover:scale-105 transition-transform duration-300">
            <Logo />
          </Link>
          <div className="hidden lg:flex gap-8">
            {navItems.map((item) => (
              item.href.startsWith('#') && isHome ? (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-[10px] uppercase tracking-[0.3em] hover:text-gold transition-colors font-medium"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setLang('ro')} 
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${lang === 'ro' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10 hover:border-white/40'}`}
            >
              RO
            </button>
            <button 
              onClick={() => setLang('ru')} 
              className={`text-[10px] font-bold px-3 py-1 rounded-full border transition-all ${lang === 'ru' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10 hover:border-white/40'}`}
            >
              RU
            </button>
          </div>
          <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-black z-[60] p-12 flex flex-col justify-center items-center gap-8 lg:hidden"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white">
              <X size={32} />
            </button>
            {navItems.map((item) => (
              item.href.startsWith('#') && isHome ? (
                <a 
                  key={item.name} 
                  href={item.href} 
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="text-3xl font-serif tracking-widest text-white uppercase"
                >
                  {item.name}
                </a>
              ) : (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-serif tracking-widest text-white uppercase"
                >
                  {item.name}
                </Link>
              )
            ))}
            <div className="flex gap-6 pt-12 border-t border-white/10 w-full justify-center">
              <button onClick={() => { setLang('ro'); setIsOpen(false); }} className={`text-sm uppercase tracking-widest ${lang === 'ro' ? 'text-gold' : 'text-white/40'}`}>Română</button>
              <button onClick={() => { setLang('ru'); setIsOpen(false); }} className={`text-sm uppercase tracking-widest ${lang === 'ru' ? 'text-gold' : 'text-white/40'}`}>Русский</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
