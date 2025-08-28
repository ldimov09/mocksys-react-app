import { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

// Utility: get value from nested object using dot.notation
function getNested(obj, path, fallback) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? fallback ?? path;
}

export function TranslationProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const stored = localStorage.getItem('locale');
    return stored ? JSON.parse(stored) : 'en'; // default to en
  });

  const [translations, setTranslations] = useState({});

  useEffect(() => {
    async function loadTranslations() {
      try {
        const data = await import(`../assets/lang/${locale}/translations.json`);
        setTranslations(data.default || data);
      } catch (e) {
        console.error(`Missing translation file for locale: ${locale}`, e);
        setTranslations({});
      }
    }
    loadTranslations();
  }, [locale]);

  const setLocale = (loc) => {
    setLocaleState(loc);
    localStorage.setItem('locale', JSON.stringify(loc));
  };

  const t = (key, fallback) => getNested(translations, key, fallback);

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}


export const useTranslations = () => useContext(TranslationContext);
