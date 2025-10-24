import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const handleScrollToVerify = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.querySelector('#verificar')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative bg-white pt-20 sm:pt-24 lg:pt-32 pb-20 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1504813182697-352485c2b043?q=80&w=1894&auto=format&fit=crop')"}}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                {t('hero.title')}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                {t('hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={handleScrollToVerify}
                    className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                    {t('hero.cta_verify')}
                </button>
                <a href="#saiba-mais" onClick={(e) => { e.preventDefault(); document.querySelector('#saiba-mais')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="bg-slate-100 text-slate-700 font-semibold py-3 px-8 rounded-lg hover:bg-slate-200 transition-all duration-300 w-full sm:w-auto"
                >
                    {t('hero.cta_learn')}
                </a>
            </div>
        </div>
    </section>
  );
};

export default Hero;