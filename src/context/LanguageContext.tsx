import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translation } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translation | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ro');
  const [allTranslations, setAllTranslations] = useState<any>(null);

  useEffect(() => {
    fetch('/api/translations')
      .then(res => res.json())
      .then(data => setAllTranslations(data))
      .catch(err => console.error('Failed to fetch translations', err));
  }, []);

  // Helper to transform the flat translations into the nested structure the app expects
  const getT = () => {
    if (!allTranslations) return null;
    
    // If the translations are already in the expected format (nested by lang)
    if (allTranslations.ro && allTranslations.ru) {
      return allTranslations[lang];
    }

    // If they are in the flat format { key: { ro: '', ru: '' } }
    const t: any = {};
    Object.keys(allTranslations).forEach(key => {
      t[key] = allTranslations[key][lang];
    });
    return t;
  };

  const t = getT();

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
