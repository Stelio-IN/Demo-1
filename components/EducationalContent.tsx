import React, { useState, useMemo } from 'react';
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

const GlobalAlerts = () => {
    const { t } = useLanguage();

    const hotspots = useMemo(() => [
        { id: 1, top: '45%', left: '80%', title: t('education.hotspot1_title'), description: t('education.hotspot1_desc') },
        { id: 2, top: '30%', left: '55%', title: t('education.hotspot2_title'), description: t('education.hotspot2_desc') },
        { id: 3, top: '55%', left: '52%', title: t('education.hotspot3_title'), description: t('education.hotspot3_desc') },
        { id: 4, top: '40%', left: '20%', title: t('education.hotspot4_title'), description: t('education.hotspot4_desc') },
    ], [t]);
    
    const [activeHotspot, setActiveHotspot] = useState(hotspots[0]);

    return (
        <div className="mt-20">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <h3 className="text-2xl font-bold text-center mb-4 text-slate-800">{t('education.global_alerts_title')}</h3>
                <p className="text-lg text-slate-600">{t('education.global_alerts_subtitle')}</p>
            </div>
            <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 relative aspect-video rounded-lg overflow-hidden bg-slate-200">
                    <iframe 
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-132.5390625%2C-40.68695842998529%2C149.23828125%2C71.35129539603589" 
                        className="absolute top-0 left-0 w-full h-full border-0 pointer-events-none"
                        title="World Map"
                    ></iframe>
                     <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 1000 562.5">
                        <defs>
                            <style>
                                {`
                                    .route-path {
                                        stroke-width: 3;
                                        stroke: rgba(220, 38, 38, 0.7);
                                        stroke-dasharray: 8 8;
                                        fill: none;
                                        animation: dash 40s linear infinite;
                                    }
                                    @keyframes dash {
                                        to {
                                            stroke-dashoffset: -1000;
                                        }
                                    }
                                `}
                            </style>
                        </defs>
                        {/* Sudeste Asiático -> América do Norte */}
                        <path className="route-path" d="M850,250 C 700,50 350,50 180,180" />
                        {/* Leste Europeu -> Europa Ocidental */}
                        <path className="route-path" d="M600,160 C 580,150 540,160 520,170" />
                        {/* África Subsaariana -> Europa e Oriente Médio */}
                        <path className="route-path" d="M540,350 C 520,250 550,200 580,180" />
                        {/* América Latina -> América do Norte e Europa */}
                        <path className="route-path" d="M280,380 C 200,250 300,150 500,180" />
                        <path className="route-path" d="M280,380 C 250,300 240,250 220,200" />
                    </svg>

                    {hotspots.map(spot => (
                        <button
                          key={spot.id}
                          onClick={() => setActiveHotspot(spot)}
                          style={{ top: spot.top, left: spot.left }}
                          aria-label={`Informação sobre ${spot.title}`}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xl transition-transform hover:scale-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-400 z-10"
                        >
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75`}></span>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-2 space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg h-full flex flex-col">
                        <div>
                            <h4 className="font-bold text-lg text-blue-700">{activeHotspot.title}</h4>
                            <p className="mt-1 text-sm text-slate-600">{activeHotspot.description}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                            <div>
                               <h4 className="font-bold text-lg text-slate-800">{t('education.seasons_title')}</h4>
                               <p className="mt-1 text-sm text-slate-600">{t('education.seasons_desc')}</p>
                            </div>
                             <div>
                               <h4 className="font-bold text-lg text-slate-800">{t('education.lures_title')}</h4>
                               <p className="mt-1 text-sm text-slate-600">{t('education.lures_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const EducationalContent = () => {
    const { t } = useLanguage();
    return (
        <section id="saiba-mais" className="py-20 sm:py-24 bg-slate-100">
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

                <GlobalAlerts />

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