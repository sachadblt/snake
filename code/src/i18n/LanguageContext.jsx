import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('fr');

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const t = (key) => {
    // New translation format: keys top-level, with language sub-objects
    // Example: translations.app.title = { fr: 'Mon', en: 'My' }
    const translationNode = getNestedValue(translations, key);

    // If translation node itself is an object with language codes, pick currentLanguage
    if (translationNode && typeof translationNode === 'object' && !Array.isArray(translationNode)) {
      if (translationNode[currentLanguage]) return translationNode[currentLanguage];
      if (translationNode['en']) return translationNode['en'];
    }

    // Backwards compatibility: if translations were previously keyed by language
    // we try the old format: translations[currentLanguage].<key>
    const oldFormat = getNestedValue(translations[currentLanguage] || {}, key);
    if (oldFormat !== undefined && oldFormat !== null) return oldFormat;

    // As last resort, try english from old format
    const oldFallback = getNestedValue(translations['en'] || {}, key);
    if (oldFallback !== undefined && oldFallback !== null) return oldFallback;

    // Fallback: return the key
    return key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};