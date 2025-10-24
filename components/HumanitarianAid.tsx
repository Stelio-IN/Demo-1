import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// FIX: Replaced JSX.Element with React.ReactElement to fix "Cannot find namespace 'JSX'" error.
const AidCard = ({ icon, title, description, buttonText }: { icon: React.ReactElement, title: string, description: string, buttonText: string }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col text-center items-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
        <p className="mt-4 text-slate-600 flex-grow">{description}</p>
        <button className="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
            {buttonText}
        </button>
    </div>
);

const HumanitarianAid = () => {
    const { t } = useLanguage();

    const financialIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    );

    const productsIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
    );

    return (
        <section id="ajuda" className="py-20 sm:py-24 bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('aid.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('aid.subtitle')}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <AidCard
                        icon={financialIcon}
                        title={t('aid.financial_title')}
                        description={t('aid.financial_desc')}
                        buttonText={t('aid.financial_cta')}
                    />
                    <AidCard
                        icon={productsIcon}
                        title={t('aid.products_title')}
                        description={t('aid.products_desc')}
                        buttonText={t('aid.products_cta')}
                    />
                </div>
            </div>
        </section>
    );
};

export default HumanitarianAid;
