"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Locale } from "@/lib/content";

const localeStorageKey = "amine-portfolio-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  content: (typeof translations)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "it";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(localeStorageKey);

    if (isLocale(storedLocale)) {
      queueMicrotask(() => setLocale(storedLocale));
      return;
    }

    if (window.navigator.language.toLowerCase().startsWith("it")) {
      queueMicrotask(() => setLocale("it"));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(localeStorageKey, locale);
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale: () => setLocale((current) => (current === "en" ? "it" : "en")),
      content: translations[locale],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}
