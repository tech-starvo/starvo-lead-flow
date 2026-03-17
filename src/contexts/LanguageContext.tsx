import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { LocaleCode } from "@/locales/translations";
import { translations, type TranslationKeys } from "@/locales/translations";

const STORAGE_KEY = "starvo-locale";

type LanguageContextValue = {
  locale: LocaleCode;
  setLocale: (code: LocaleCode) => void;
  t: (key: keyof TranslationKeys) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
    if (stored && translations[stored]) return stored;
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code);
  }, []);

  const t = useCallback(
    (key: keyof TranslationKeys): string => {
      const dict = translations[locale];
      return dict[key] ?? (translations.en[key] as string) ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
