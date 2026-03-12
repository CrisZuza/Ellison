import React, { createContext, useContext, useState, useEffect } from 'react';
import { Master, Service, Product, Course } from '../types';

interface DataContextType {
  masters: Master[];
  services: Service[];
  products: Product[];
  courses: Course[];
  gallery: any[];
  settings: any;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masters, setMasters] = useState<Master[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [m, s, p, c, g, st] = await Promise.all([
        fetch('/api/masters').then(res => res.json()),
        fetch('/api/services').then(res => res.json()),
        fetch('/api/products').then(res => res.json()),
        fetch('/api/courses').then(res => res.json()),
        fetch('/api/gallery').then(res => res.json()),
        fetch('/api/settings').then(res => res.json()),
      ]);
      setMasters(m);
      setServices(s);
      setProducts(p);
      setCourses(c);
      setGallery(g);
      setSettings(st[0] || {});
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      masters, 
      services, 
      products, 
      courses, 
      gallery, 
      settings, 
      isLoading,
      refreshData: fetchData 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
