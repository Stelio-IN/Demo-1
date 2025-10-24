import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white">SafeLink</h3>
            <p className="mt-2 text-sm text-slate-400">
             {t('footer.about')}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t('footer.resources_title')}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="https://www.gov.br/mdh/pt-br/disque-100" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.resource1')}</a></li>
              <li><a href="https://www.unodc.org/lpo-brazil/pt/trafico-de-pessoas/index.html" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.resource2')}</a></li>
              <li><a href="https://www.childhood.org.br/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('footer.resource3')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{t('footer.disclaimer_title')}</h3>
            <p className="mt-2 text-sm text-slate-400">
              {t('footer.disclaimer_text')}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} SafeLink. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;