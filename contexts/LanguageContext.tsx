import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import pt from '../locales/pt.json';
import en from '../locales/en.json';
import cn from '../locales/cn.json';

type Translations = Record<string, any>;
type Language = 'pt' | 'en' | 'cn';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// FIX: Added explicit return type `React.ReactElement | null` to aid TypeScript's type inference, resolving a potential issue in how the component's type is consumed.
export const LanguageProvider = ({ children }: { children: ReactNode }): React.ReactElement | null => {
    const [language, setLanguage] = useState<Language>('pt');
    const [translations, setTranslations] = useState<Record<Language, Translations> | null>(null);

    useEffect(() => {
        setTranslations({ pt, en, cn });
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