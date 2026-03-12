import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Chat } from "@google/genai";
import { createReportChat, isGeminiConfigured } from '../services/geminiService';

// Tipos
type ReportMode = 'simple' | 'guided' | 'chat';

interface ChatMessage {
  author: 'user' | 'ai';
  text: string;
}

// Subcomponente: Relato Simples
const SimpleReportForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description.trim()) {
            // Lógica para enviar os dados estaria aqui
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="description" className="block text-lg font-semibold text-slate-800">{t('report.form_label')}</label>
                    <p className="text-sm text-slate-500 mb-2">{t('report.form_disclaimer')}</p>
                    <textarea
                        id="description"
                        name="description"
                        rows={8}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
    );
};

// Subcomponente: Formulário Guiado
const GuidedReportForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const { t } = useLanguage();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="what_happened" className="block font-semibold text-slate-800">{t('report.form_guided_what')}</label>
                <p className="text-sm text-slate-500 mb-1">{t('report.form_guided_what_desc')}</p>
                <textarea id="what_happened" rows={4} className="w-full p-3 border border-slate-300 rounded-md" placeholder={t('report.form_guided_what_placeholder')} />
            </div>
            <div>
                <label htmlFor="who_involved" className="block font-semibold text-slate-800">{t('report.form_guided_who')}</label>
                 <p className="text-sm text-slate-500 mb-1">{t('report.form_guided_who_desc')}</p>
                <textarea id="who_involved" rows={3} className="w-full p-3 border border-slate-300 rounded-md" placeholder={t('report.form_guided_who_placeholder')} />
            </div>
             <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="where_happened" className="block font-semibold text-slate-800">{t('report.form_guided_where')}</label>
                    <input type="text" id="where_happened" className="w-full p-3 border border-slate-300 rounded-md" placeholder={t('report.form_guided_where_placeholder')} />
                </div>
                <div>
                    <label htmlFor="when_happened" className="block font-semibold text-slate-800">{t('report.form_guided_when')}</label>
                    <input type="text" id="when_happened" className="w-full p-3 border border-slate-300 rounded-md" placeholder={t('report.form_guided_when_placeholder')} />
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
    );
};

// Subcomponente: Chat com IA
const ChatReportForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatUnavailable, setChatUnavailable] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const systemInstruction = t('report.chat_system_instruction');

        if (!isGeminiConfigured()) {
            setChatUnavailable(true);
            setMessages([]);
            return;
        }

        try {
            chatRef.current = createReportChat(systemInstruction);
            setMessages([{ author: 'ai', text: t('report.chat_initial_message') }]);
        } catch (error) {
            console.error("Chat initialization error:", error);
            setChatUnavailable(true);
            setMessages([]);
        }
    }, [t]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatRef.current || chatUnavailable) return;

        const userMessage: ChatMessage = { author: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: currentInput });
            const aiMessage: ChatMessage = { author: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { author: 'ai', text: t('report.chat_error') };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            {chatUnavailable && (
                <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900">
                    {t('report.chat_unavailable')}
                </div>
            )}
            <div className="h-96 overflow-y-auto p-4 bg-white border border-slate-200 rounded-md space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl ${msg.author === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                           {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="max-w-xs p-3 rounded-xl bg-slate-200 text-slate-800">
                           <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('report.chat_placeholder')}
                    className="flex-grow p-3 border border-slate-300 rounded-md"
                    disabled={isLoading || chatUnavailable}
                />
                <button type="submit" className="bg-blue-600 text-white font-semibold px-6 rounded-md disabled:bg-slate-400" disabled={isLoading || chatUnavailable}>
                    {t('report.chat_send')}
                </button>
            </form>
             <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-sm text-center text-red-700 font-semibold bg-red-100 p-3 rounded-md">
                    {t('report.form_warning')}
                </p>
                <button onClick={onSubmit} className="mt-6 w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
                    {t('report.form_button_chat')}
                </button>
            </div>
        </div>
    );
};

// Componente Principal
const Report = () => {
    const { t } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [mode, setMode] = useState<ReportMode>('simple');

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
                 <div className="mt-12 max-w-3xl mx-auto bg-slate-50 p-8 rounded-xl shadow-lg border border-slate-200">
                     <div className="flex border-b border-slate-200 mb-6 -mx-8 px-4 sm:px-8">
                        <button onClick={() => setMode('simple')} className={`px-4 sm:px-6 py-3 font-semibold text-base sm:text-lg transition-colors whitespace-nowrap ${mode === 'simple' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-800'}`}>
                           {t('report.tab_simple')}
                        </button>
                        <button onClick={() => setMode('guided')} className={`px-4 sm:px-6 py-3 font-semibold text-base sm:text-lg transition-colors whitespace-nowrap ${mode === 'guided' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-800'}`}>
                           {t('report.tab_guided')}
                        </button>
                        <button onClick={() => setMode('chat')} className={`px-4 sm:px-6 py-3 font-semibold text-base sm:text-lg transition-colors whitespace-nowrap ${mode === 'chat' ? 'border-b-2 border-red-600 text-red-600' : 'text-slate-500 hover:text-slate-800'}`}>
                           {t('report.tab_chat')}
                        </button>
                    </div>
                   
                    {mode === 'simple' && <SimpleReportForm onSubmit={() => setSubmitted(true)} />}
                    {mode === 'guided' && <GuidedReportForm onSubmit={() => setSubmitted(true)} />}
                    {mode === 'chat' && <ChatReportForm onSubmit={() => setSubmitted(true)} />}
                 </div>
            </div>
        </section>
    );
};

export default Report;