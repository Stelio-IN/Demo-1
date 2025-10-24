import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Report = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
             <section id="denunciar" className="py-20 sm:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('report.success_title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('report.success_subtitle')}</p>
                     <a href="https://www.gov.br/mdh/pt-br/disque-100" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block bg-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors">
                        {t('report.success_cta')}
                     </a>
                </div>
            </section>
        );
    }

    return (
        <section id="denunciar" className="py-20 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('report.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('report.subtitle')}</p>
                </div>
                 <form onSubmit={handleSubmit} className="mt-12 max-w-3xl mx-auto bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="description" className="block text-lg font-semibold text-slate-800">{t('report.form_label')}</label>
                            <p className="text-sm text-slate-500 mb-2">{t('report.form_disclaimer')}</p>
                            <textarea
                                id="description"
                                name="description"
                                rows={8}
                                required
                                className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                                placeholder={t('report.form_placeholder')}
                            ></textarea>
                        </div>
                    </div>
                     <div className="mt-8 border-t border-slate-200 pt-6">
                         <p className="text-sm text-center text-red-700 font-semibold bg-red-100 p-3 rounded-md">
                           {t('report.form_warning')}
                         </p>
                        <button type="submit" className="mt-6 w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
                            {t('report.form_button')}
                        </button>
                     </div>
                 </form>
            </div>
        </section>
    );
};

export default Report;