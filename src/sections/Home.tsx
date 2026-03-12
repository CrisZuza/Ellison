import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Clock, Phone, Instagram, Facebook } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { Logo } from '../components/Logo';
import { Service, Master, Product } from '../types';

interface HomeProps {
  onBook: (service?: Service) => void;
}

export const Home: React.FC<HomeProps> = ({ onBook }) => {
  const { t, lang } = useTranslation();
  const { masters, services, products, gallery, settings, isLoading } = useData();

  React.useEffect(() => {
    if (t) {
      document.title = lang === 'ro' 
        ? "ÉLLISON BEAUTY ROOM — Eleganță și Frumusețe"
        : "ÉLLISON BEAUTY ROOM — Элегантность и Красота";
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
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1920&h=1080" 
            alt="Luxury Beauty" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] uppercase tracking-[0.6em] text-gold mb-8 block font-bold">Chisinau, Moldova</span>
            <div className="mb-12">
              <Logo className="scale-150 md:scale-[2.5]" />
            </div>
            <p className="text-xs md:text-sm text-white/50 mb-16 max-w-xl mx-auto font-sans tracking-[0.4em] leading-relaxed uppercase font-medium">
              {t.hero.subtitle}
            </p>
            <button 
              onClick={() => onBook()}
              className="luxury-button-filled group"
            >
              <span className="relative z-10">{t.hero.cta}</span>
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
          <div className="w-px h-24 bg-white" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Our Story</span>
              <h2 className="text-6xl md:text-7xl font-serif text-white mb-8 uppercase tracking-widest">{t.about.title}</h2>
              <p className="text-white/60 leading-relaxed text-lg mb-8 font-light uppercase tracking-widest">
                {t.about.content}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-gold text-4xl font-serif mb-2">5+</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Years of Excellence</p>
                </div>
                <div>
                  <h4 className="text-gold text-4xl font-serif mb-2">10k+</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Happy Clients</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden luxury-shadow border border-white/5"
            >
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Salon Atmosphere" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Services</span>
              <h2 className="text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{t.services.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-20">
            {services.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group flex flex-col"
              >
                <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6 group-hover:border-gold transition-colors">
                  <div>
                    <h3 className="text-3xl font-serif mb-2 text-white group-hover:gold-text transition-all uppercase tracking-widest">{service.name[lang]}</h3>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">{service.duration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif text-white tracking-widest">{service.price} MDL</span>
                  </div>
                </div>
                <button 
                  onClick={() => onBook(service)}
                  className="self-start text-[10px] uppercase tracking-[0.4em] font-bold flex items-center gap-3 text-gold opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
                >
                  {t.services.book} <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Masters Section */}
      <section id="masters" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">The Team</span>
            <h2 className="text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{t.masters.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {masters.map((master, idx) => (
              <motion.div 
                key={master.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group text-center"
              >
                <div className="relative mb-10 overflow-hidden aspect-[3/4] rounded-xl luxury-shadow border border-white/5">
                  <img 
                    src={master.image} 
                    alt={master.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-3xl font-serif mb-3 text-white uppercase tracking-widest">{master.name}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">{master.specialty[lang]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Visuals</span>
            <h2 className="text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{t.gallery.title}</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="aspect-square overflow-hidden rounded-xl border border-white/5"
              >
                <img 
                  src={item.url} 
                  alt={item.alt || `Gallery ${idx}`} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 cursor-pointer"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Reviews</span>
            <h2 className="text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{t.testimonials.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {t.testimonials.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-12 rounded-2xl bg-white/5 border border-white/5 relative"
              >
                <span className="text-6xl font-serif text-gold/20 absolute top-8 left-8">“</span>
                <p className="text-white/60 italic mb-8 relative z-10 leading-relaxed uppercase tracking-widest text-sm">
                  {item.text}
                </p>
                <h4 className="text-white font-serif uppercase tracking-widest text-sm">{item.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-32 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-24">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Shop</span>
              <h2 className="text-6xl md:text-7xl font-serif text-white uppercase tracking-widest">{t.products.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square mb-8 overflow-hidden bg-white/5 rounded-2xl border border-white/5">
                  <img 
                    src={product.image} 
                    alt={product.name[lang]} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white text-black px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      {t.products.buy}
                    </span>
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-serif mb-2 text-white uppercase tracking-widest">{product.name[lang]}</h3>
                  <p className="text-gold font-bold tracking-widest">{product.price} MDL</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 block font-bold">Location</span>
              <h2 className="text-6xl md:text-7xl font-serif text-white mb-12 uppercase tracking-widest">{t.contact.title}</h2>
              
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl mb-2 uppercase tracking-widest">Address</h4>
                    <p className="text-white/40 text-sm uppercase tracking-widest">{settings.address || t.footer.address}</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl mb-2 uppercase tracking-widest">{t.contact.hours}</h4>
                    <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] space-y-2 font-bold">
                      <p>{t.contact.weekdays}: {settings.hours?.weekdays || '09:00 - 20:00'}</p>
                      <p>{t.contact.weekend}: {settings.hours?.weekend || '10:00 - 18:00'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-white font-serif text-xl mb-2 uppercase tracking-widest">Phone</h4>
                    <p className="text-white/40 text-sm uppercase tracking-widest">{settings.phone || '+373 60 000 000'}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold mb-6 font-bold">{t.contact.follow}</h4>
                  <div className="flex gap-6">
                    <a href={settings.social?.instagram || "#"} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-white transition-all"><Instagram size={20} /></a>
                    <a href={settings.social?.facebook || "#"} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-white transition-all"><Facebook size={20} /></a>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-[2rem] overflow-hidden border border-white/5 luxury-shadow"
            >
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gold/20 mx-auto mb-4" />
                  <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Interactive Map Placeholder</p>
                </div>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.243547144211!2d28.8322!3d47.0101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDAwJzM2LjQiTiAyOMKwNDknNTUuOSJF!5e0!3m2!1sen!2s!4v1625561000000!5m2!1sen!2s" 
                className="absolute inset-0 w-full h-full grayscale invert opacity-40 hover:opacity-60 transition-opacity duration-500"
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
