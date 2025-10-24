import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Translations = Record<string, any>;
type Language = 'pt' | 'en' | 'cn';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('pt');
    const [translations, setTranslations] = useState<Record<Language, Translations> | null>(null);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const [pt, en, cn] = await Promise.all([
                    fetch('/locales/pt.json').then(res => res.json()),
                    fetch('/locales/en.json').then(res => res.json()),
                    fetch('/locales/cn.json').then(res => res.json())
                ]);
                setTranslations({ pt, en, cn });
            } catch (error) {
                console.error("Failed to load translation files:", error);
                // Set empty objects to prevent the app from crashing
                setTranslations({ pt: {}, en: {}, cn: {} });
            }
        };
        fetchTranslations();
    }, []);


    const t = (key: string): string => {
        if (!translations) {
            return key; // Return key as a fallback during loading
        }
        const keys = key.split('.');
        let result: any = translations[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Fallback to Portuguese if key not found in the current language
                let fallbackResult: any = translations.pt;
                 for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                 }
                 return fallbackResult || key;
            }
        }
        return result || key;
    };
    
    // Render children only after translations have been loaded
    if (!translations) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: (lang) => setLanguage(lang as Language), t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};