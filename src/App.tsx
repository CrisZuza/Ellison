import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './sections/Home';
import { Courses } from './sections/Courses';
import { CourseDetail } from './sections/CourseDetail';
import { BookingModal } from './components/BookingModal';
import { Service } from './types';

// Admin Imports
import { AdminLayout } from './admin/AdminLayout';
import { Login } from './admin/Login';
import { Dashboard } from './admin/Dashboard';
import { MastersManager } from './admin/MastersManager';
import { ServicesManager } from './admin/ServicesManager';
import { CoursesManager } from './admin/CoursesManager';
import { ProductsManager } from './admin/ProductsManager';
import { GalleryManager } from './admin/GalleryManager';
import { TranslationsManager } from './admin/TranslationsManager';
import { SettingsManager } from './admin/SettingsManager';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);

  return null;
}

const PublicLayout = ({ onBook }: { onBook: (service?: Service) => void }) => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home onBook={onBook} />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();

  const handleBook = (service?: Service) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black">
      <ScrollToTop />
      
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="masters" element={<MastersManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="translations" element={<TranslationsManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout onBook={handleBook} />} />
      </Routes>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        selectedService={selectedService}
      />
    </div>
  );
}
