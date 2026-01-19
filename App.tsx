
import React, { useState, useEffect, useCallback } from 'react';
import { GlucoseEntry } from './types';
import { GlucoseForm } from './components/GlucoseForm';
import { GlucoseChart } from './components/GlucoseChart';
import { HistoryList } from './components/HistoryList';
import { getGlucoseInsights } from './services/geminiService';
import { LEVEL_METADATA } from './constants';

const App: React.FC = () => {
  const [entries, setEntries] = useState<GlucoseEntry[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  const addEntry = (entry: GlucoseEntry) => {
    setEntries(prev => [...prev, entry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const generateInsights = async () => {
    if (entries.length === 0) return;
    setIsInsightLoading(true);
    try {
      const insight = await getGlucoseInsights(entries);
      setAiInsight(insight);
    } finally {
      setIsInsightLoading(false);
    }
  };

  const latestEntry = entries[entries.length - 1];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">GlucoTrack AI</h1>
              <p className="text-xs text-slate-500">Smart Glucose Management</p>
            </div>
          </div>
          <button 
            onClick={generateInsights}
            disabled={entries.length === 0 || isInsightLoading}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInsightLoading ? 'Thinking...' : 'AI Insights'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-6">
        
        {/* Top Section: Quick Summary & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GlucoseForm onAddEntry={addEntry} />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status Card */}
            {latestEntry ? (
              <div className={`p-6 rounded-2xl border transition-all ${LEVEL_METADATA[latestEntry.level].bgColor} border-current/10 shadow-sm`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Last Reading</span>
                    <h3 className={`text-3xl font-black ${LEVEL_METADATA[latestEntry.level].color}`}>
                      {latestEntry.value} <span className="text-base font-medium opacity-70">mg/dL</span>
                    </h3>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${LEVEL_METADATA[latestEntry.level].bgColor} ${LEVEL_METADATA[latestEntry.level].color} border-current/20`}>
                    {LEVEL_METADATA[latestEntry.level].label}
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {LEVEL_METADATA[latestEntry.level].description}
                </p>
              </div>
            ) : (
              <div className="p-8 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-center">
                <div>
                  <h3 className="text-blue-900 font-semibold mb-1">Welcome to GlucoTrack AI</h3>
                  <p className="text-blue-700/70 text-sm">Enter your first reading to start tracking your health journey.</p>
                </div>
              </div>
            )}

            {/* AI Insights Display */}
            {aiInsight && (
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-indigo-600 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Gemini Health Insights</h4>
                </div>
                <div className="prose prose-sm text-indigo-900/80 prose-indigo">
                  {aiInsight.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0 leading-snug">{line}</p>
                  ))}
                </div>
                <button 
                  onClick={() => setAiInsight(null)}
                  className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Section: Chart */}
        <div className="grid grid-cols-1 gap-6">
          <GlucoseChart entries={entries} />
        </div>

        {/* Bottom Section: History */}
        <div className="grid grid-cols-1 gap-6">
          <HistoryList entries={entries} onDelete={deleteEntry} />
        </div>

      </main>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 mt-12 text-center">
        <div className="bg-slate-100 p-4 rounded-xl inline-block border border-slate-200">
          <p className="text-[10px] text-slate-500 max-w-lg">
            <strong>Disclaimer:</strong> This application is for informational purposes only and does not constitute medical advice. Always seek the guidance of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
