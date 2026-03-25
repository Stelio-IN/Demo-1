import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type CaseTone = 'stable' | 'attention' | 'critical';

type ReintegrationCase = {
    id: string;
    name: string;
    situation: string;
    tone: CaseTone;
    stage: number;
    risk: string;
    updatedAt: string;
    nextFollowUp: string;
    needs: string[];
    timeline: Array<{ date: string; event: string }>;
};

const Reintegration = () => {
    const { t } = useLanguage();

    const cases = useMemo<ReintegrationCase[]>(() => ([
        {
            id: 'case_a',
            name: t('reintegration.case_a_name'),
            situation: t('reintegration.case_a_situation'),
            tone: 'attention',
            stage: 2,
            risk: t('reintegration.risk_medium'),
            updatedAt: t('reintegration.case_a_updated'),
            nextFollowUp: t('reintegration.case_a_next_followup'),
            needs: [
                t('reintegration.case_a_need_1'),
                t('reintegration.case_a_need_2'),
                t('reintegration.case_a_need_3')
            ],
            timeline: [
                { date: t('reintegration.case_a_timeline_1_date'), event: t('reintegration.case_a_timeline_1_event') },
                { date: t('reintegration.case_a_timeline_2_date'), event: t('reintegration.case_a_timeline_2_event') },
                { date: t('reintegration.case_a_timeline_3_date'), event: t('reintegration.case_a_timeline_3_event') }
            ]
        },
        {
            id: 'case_b',
            name: t('reintegration.case_b_name'),
            situation: t('reintegration.case_b_situation'),
            tone: 'stable',
            stage: 4,
            risk: t('reintegration.risk_low'),
            updatedAt: t('reintegration.case_b_updated'),
            nextFollowUp: t('reintegration.case_b_next_followup'),
            needs: [
                t('reintegration.case_b_need_1'),
                t('reintegration.case_b_need_2'),
                t('reintegration.case_b_need_3')
            ],
            timeline: [
                { date: t('reintegration.case_b_timeline_1_date'), event: t('reintegration.case_b_timeline_1_event') },
                { date: t('reintegration.case_b_timeline_2_date'), event: t('reintegration.case_b_timeline_2_event') },
                { date: t('reintegration.case_b_timeline_3_date'), event: t('reintegration.case_b_timeline_3_event') }
            ]
        },
        {
            id: 'case_c',
            name: t('reintegration.case_c_name'),
            situation: t('reintegration.case_c_situation'),
            tone: 'critical',
            stage: 1,
            risk: t('reintegration.risk_high'),
            updatedAt: t('reintegration.case_c_updated'),
            nextFollowUp: t('reintegration.case_c_next_followup'),
            needs: [
                t('reintegration.case_c_need_1'),
                t('reintegration.case_c_need_2'),
                t('reintegration.case_c_need_3')
            ],
            timeline: [
                { date: t('reintegration.case_c_timeline_1_date'), event: t('reintegration.case_c_timeline_1_event') },
                { date: t('reintegration.case_c_timeline_2_date'), event: t('reintegration.case_c_timeline_2_event') },
                { date: t('reintegration.case_c_timeline_3_date'), event: t('reintegration.case_c_timeline_3_event') }
            ]
        }
    ]), [t]);

    const [selectedCaseId, setSelectedCaseId] = useState<string>('case_a');
    const activeCase = cases.find((item) => item.id === selectedCaseId) || cases[0];

    const stageLabels = [
        t('reintegration.stage_rescue'),
        t('reintegration.stage_shelter'),
        t('reintegration.stage_health'),
        t('reintegration.stage_training'),
        t('reintegration.stage_employment')
    ];

    const toneStyles: Record<CaseTone, string> = {
        stable: 'bg-emerald-100 text-emerald-700',
        attention: 'bg-amber-100 text-amber-700',
        critical: 'bg-rose-100 text-rose-700'
    };

    const toneLabels: Record<CaseTone, string> = {
        stable: t('reintegration.status_stable'),
        attention: t('reintegration.status_attention'),
        critical: t('reintegration.status_critical')
    };

    return (
        <section id="reintegracao" className="py-20 sm:py-24 bg-slate-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('reintegration.title')}</h2>
                    <p className="mt-4 text-lg text-slate-600">{t('reintegration.subtitle')}</p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                    {cases.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedCaseId(item.id)}
                            className={`rounded-xl border p-4 text-left transition ${item.id === activeCase.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow'}`}
                        >
                            <p className="text-xs uppercase tracking-wide opacity-80">{t('reintegration.case_label')}</p>
                            <p className="mt-1 text-base font-semibold">{item.name}</p>
                            <p className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.id === activeCase.id ? 'bg-white/20 text-white' : toneStyles[item.tone]}`}>
                                {toneLabels[item.tone]}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-5">
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-slate-500">{t('reintegration.case_label')}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{activeCase.name}</h3>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${toneStyles[activeCase.tone]}`}>
                                {toneLabels[activeCase.tone]}
                            </span>
                        </div>

                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{t('reintegration.situation_label')}</p>
                                <p className="mt-2 text-slate-700">{activeCase.situation}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{t('reintegration.risk_label')}</p>
                                <p className="mt-2 font-semibold text-slate-800">{activeCase.risk}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{t('reintegration.updated_label')}</p>
                                <p className="mt-2 text-slate-700">{activeCase.updatedAt}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                <p className="text-xs uppercase tracking-wide text-slate-500">{t('reintegration.next_followup_label')}</p>
                                <p className="mt-2 text-slate-700">{activeCase.nextFollowUp}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-700">{t('reintegration.current_needs_title')}</p>
                            <ul className="mt-3 space-y-2">
                                {activeCase.needs.map((need, index) => (
                                    <li key={index} className="flex items-start gap-2 text-slate-700">
                                        <span className="mt-2 block h-2 w-2 rounded-full bg-blue-500"></span>
                                        <span>{need}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                        <h4 className="text-lg font-bold text-slate-900">{t('reintegration.followup_title')}</h4>
                        <div className="mt-5 space-y-4">
                            {activeCase.timeline.map((item, index) => (
                                <div key={index} className="relative pl-5">
                                    <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                                    {index !== activeCase.timeline.length - 1 && (
                                        <span className="absolute left-[4px] top-4 h-[calc(100%+6px)] w-[1px] bg-slate-300"></span>
                                    )}
                                    <p className="text-xs uppercase tracking-wide text-slate-500">{item.date}</p>
                                    <p className="mt-1 text-sm text-slate-700">{item.event}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <p className="text-sm font-semibold text-slate-700">{t('reintegration.stage_title')}</p>
                            <div className="mt-3 space-y-2">
                                {stageLabels.map((label, index) => {
                                    const stageNumber = index + 1;
                                    const isDone = stageNumber < activeCase.stage;
                                    const isCurrent = stageNumber === activeCase.stage;

                                    return (
                                        <div key={label} className="flex items-center gap-3">
                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${isDone ? 'bg-emerald-100 text-emerald-700' : isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {stageNumber}
                                            </span>
                                            <span className={`text-sm ${isCurrent ? 'font-semibold text-blue-700' : 'text-slate-600'}`}>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reintegration;
