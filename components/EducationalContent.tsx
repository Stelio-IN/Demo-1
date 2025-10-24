import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const PlayIcon = () => (
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
        </svg>
    </div>
);

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        <p className="mt-4 text-lg text-slate-600">{subtitle}</p>
    </div>
);

const VideoCard = ({ title, description, imageUrl }: { title: string, description: string, imageUrl: string }) => (
    <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <div className="relative">
            <img src={imageUrl} alt={title} className="w-full h-56 object-cover" />
            <PlayIcon />
        </div>
        <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-slate-600">{description}</p>
        </div>
    </div>
);

const TestimonialCard = ({ quote, author }: { quote: string, author: string }) => (
    <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
        <blockquote className="text-lg text-slate-700 italic">“{quote}”</blockquote>
        <footer className="mt-4 font-semibold text-slate-800">— {author}</footer>
    </div>
);

const EducationalContent = () => {
    const { t } = useLanguage();
    return (
        <section id="saiba-mais" className="py-20 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle 
                    title={t('education.title')} 
                    subtitle={t('education.subtitle')}
                />
                
                <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">{t('education.videos_title')}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <VideoCard 
                        title={t('education.video1_title')}
                        description={t('education.video1_desc')}
                        imageUrl="https://images.unsplash.com/photo-1519253499836-15a3f595b2b2?q=80&w=1470&auto=format&fit=crop"
                    />
                    <VideoCard 
                        title={t('education.video2_title')}
                        description={t('education.video2_desc')}
                        imageUrl="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1548&auto=format&fit=crop"
                    />
                    <VideoCard 
                        title={t('education.video3_title')}
                        description={t('education.video3_desc')}
                        imageUrl="https://images.unsplash.com/photo-1557825835-b4527f242af7?q=80&w=1470&auto=format&fit=crop"
                    />
                </div>

                <div className="mt-20">
                    <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">{t('education.testimonials_title')}</h3>
                    <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <TestimonialCard 
                            quote={t('education.testimonial1_quote')}
                            author={t('education.testimonial1_author')}
                        />
                         <TestimonialCard 
                            quote={t('education.testimonial2_quote')}
                            author={t('education.testimonial2_author')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationalContent;