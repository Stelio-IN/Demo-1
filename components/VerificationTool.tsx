import React, { useState, useCallback } from 'react';
import { AnalysisResult, VerificationMode } from '../types';
import { analyzeContent } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';


const FileInput = ({ onFileSelect, fileType, disabled, t }: { onFileSelect: (file: File) => void; fileType: string, disabled: boolean, t: (key: string) => string }) => (
    <div className="mt-4 flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">{t('verification.file_input_cta')}</span> {t('verification.file_input_sub_cta')}</p>
                <p className="text-xs text-slate-500">{t('verification.file_input_hint')}</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept={fileType} disabled={disabled} onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} />
        </label>
    </div> 
);

const ResultCard = ({ result, t }: { result: AnalysisResult, t: (key: string) => string }) => {
    const getVerdictColorClasses = (verdict: string) => {
        const lowerVerdict = verdict.toLowerCase();
        if (lowerVerdict.includes('alto') || lowerVerdict.includes('high')) return 'bg-red-100 text-red-800 border-red-500';
        if (lowerVerdict.includes('médio') || lowerVerdict.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-500';
        if (lowerVerdict.includes('baixo') || lowerVerdict.includes('low')) return 'bg-blue-100 text-blue-800 border-blue-500';
        return 'bg-green-100 text-green-800 border-green-500';
    };
    
    const { verdict, explanation, recommendation } = result;
    const colorClasses = getVerdictColorClasses(verdict);

    return (
        <div className={`mt-6 p-6 rounded-lg border-l-4 ${colorClasses}`}>
            <h3 className="text-xl font-bold">{verdict}</h3>
            <p className="mt-4"><strong>{t('verification.result_explanation')}:</strong> {explanation}</p>
            <p className="mt-4"><strong>{t('verification.result_recommendation')}:</strong> {recommendation}</p>
        </div>
    );
};

const Spinner = ({ t }: { t: (key: string) => string }) => (
    <div className="flex justify-center items-center space-x-2 my-4">
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
      <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
      <p className="text-slate-600 ml-2">{t('verification.spinner_text')}</p>
    </div>
);


const VerificationTool = () => {
    const { t } = useLanguage();
    const [mode, setMode] = useState<VerificationMode>('text');
    const [inputText, setInputText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [location, setLocation] = useState('');
    const [sender, setSender] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileSelect = (file: File) => {
        setImageFile(file);
        setFileName(file.name);
    };
    
    const handleSubmit = useCallback(async () => {
        if (mode === 'text' && !inputText.trim()) {
            setError(t('verification.error_no_text'));
            return;
        }
        if (mode === 'image' && !imageFile) {
            setError(t('verification.error_no_image'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            let analysis;
            if (mode === 'image' && imageFile) {
                const base64Data = await fileToBase64(imageFile);
                const imagePayload = { mimeType: imageFile.type, data: base64Data };
                analysis = await analyzeContent(inputText, imagePayload, location, sender);
            } else {
                analysis = await analyzeContent(inputText, undefined, location, sender);
            }
            setResult(analysis);
        } catch (err: any) {
            setError(err instanceof Error && err.message === 'GEMINI_API_KEY_MISSING'
                ? t('verification.error_api_config')
                : t('verification.error_api'));
        } finally {
            setIsLoading(false);
        }
    }, [mode, inputText, imageFile, location, sender, t]);

    const resetState = () => {
        setInputText('');
        setImageFile(null);
        setFileName('');
        setLocation('');
        setSender('');
        setResult(null);
        setError(null);
    };

    const handleModeChange = (newMode: VerificationMode) => {
        setMode(newMode);
        resetState();
    };

    return (
        <section id="verificar" className="py-20 sm:py-24 bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('verification.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('verification.subtitle')}</p>
                </div>

                <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex border-b border-slate-200">
                        <button onClick={() => handleModeChange('text')} className={`px-6 py-3 font-semibold text-lg transition-colors ${mode === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                            {t('verification.tab_text')}
                        </button>
                        <button onClick={() => handleModeChange('image')} className={`px-6 py-3 font-semibold text-lg transition-colors ${mode === 'image' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>
                            {t('verification.tab_image')}
                        </button>
                    </div>

                    <div className="mt-6">
                        {mode === 'text' ? (
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                rows={6}
                                className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                placeholder={t('verification.text_placeholder')}
                                disabled={isLoading}
                            />
                        ) : (
                            <>
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    rows={2}
                                    className="w-full p-4 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('verification.image_text_placeholder')}
                                    disabled={isLoading}
                                />
                                <FileInput onFileSelect={handleFileSelect} fileType="image/*" disabled={isLoading} t={t} />
                                {fileName && <p className="text-sm text-center mt-2 text-slate-500">{t('verification.file_selected')}: {fileName}</p>}
                            </>
                        )}
                    </div>

                    <div className="mt-4">
                        <details>
                            <summary className="cursor-pointer text-slate-600 font-semibold hover:text-blue-600 list-inside">
                                {t('verification.advanced_details')}
                            </summary>
                            <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-md border border-slate-200">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('verification.location_placeholder')}
                                    disabled={isLoading}
                                />
                                <input
                                    type="text"
                                    value={sender}
                                    onChange={(e) => setSender(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder={t('verification.sender_placeholder')}
                                    disabled={isLoading}
                                />
                            </div>
                        </details>
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                       {isLoading ? t('verification.button_analyzing') : t('verification.button_submit')}
                    </button>

                    {isLoading && <Spinner t={t}/>}
                    {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
                    {result && <ResultCard result={result} t={t} />}
                </div>
            </div>
        </section>
    );
};

export default VerificationTool;
