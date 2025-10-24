import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ShareStory = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [story, setStory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send data to a server
        // For this demo, we'll just show a success message
        if (story.trim()) {
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <section id="compartilhar" className="py-20 sm:py-24 bg-slate-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('share.success_title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('share.success_subtitle')}</p>
                     <button onClick={() => {setSubmitted(false); setStory('');}} className="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                        {t('share.success_cta')}
                     </button>
                </div>
            </section>
        );
    }
    
    return (
        <section id="compartilhar" className="py-20 sm:py-24 bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                     <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('share.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('share.subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                     <div className="space-y-6">
                        <div>
                            <label htmlFor="story" className="block text-lg font-semibold text-slate-800">{t('share.form_label')}</label>
                            <p className="text-sm text-slate-500 mb-2">{t('share.form_disclaimer')}</p>
                            <textarea
                                id="story"
                                name="story"
                                rows={10}
                                value={story}
                                onChange={(e) => setStory(e.target.value)}
                                className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder={t('share.form_placeholder')}
                            ></textarea>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="consent" name="consent" type="checkbox" required className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="consent" className="font-medium text-slate-700">{t('share.form_consent')}</label>
                            </div>
                        </div>
                     </div>
                     <div className="mt-8">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            {t('share.form_button')}
                        </button>
                     </div>
                </form>
            </div>
        </section>
    );
};

export default ShareStory;