import React, { useState, useEffect } from 'react';
import { GlucoseEntry } from './types';
import { GlucoseForm } from './components/GlucoseForm';
import { GlucoseChart } from './components/GlucoseChart';
import { HistoryList } from './components/HistoryList';
import { getGlucoseInsights } from './services/geminiService';
import { LEVEL_METADATA } from './constants';
import { LayoutDashboard, BrainCircuit, Trash2, Activity, Zap, ShieldAlert, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [entries, setEntries] = useState<GlucoseEntry[]>(() => {
    const saved = localStorage.getItem('gluco_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('gluco_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: GlucoseEntry) => {
    setEntries(prev => [...prev, entry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Wipe all data? This action cannot be reversed.')) {
      setEntries([]);
      setAiInsight(null);
    }
  };

  const generateInsights = async () => {
    if (entries.length === 0) return;
    setIsInsightLoading(true);
    try {
      const insight = await getGlucoseInsights(entries);
      setAiInsight(insight);
    } catch (err) {
      setAiInsight("AI services are temporarily unavailable. Please check your network.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-[100] border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">GlucoTrack AI</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-[0.2em] mt-1.5">Metabolic Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {entries.length > 0 && (
              <button 
                onClick={clearAll}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Reset Database"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={generateInsights}
              disabled={entries.length === 0 || isInsightLoading}
              className="flex items-center gap-2.5 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <Sparkles size={18} className={isInsightLoading ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
              {isInsightLoading ? 'Processing...' : 'Get AI Insight'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-10">
        
        {/* Upper Dashboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 animate-fade-in">
            <GlucoseForm onAddEntry={addEntry} />
          </div>
          
          <div className="lg:col-span-8 space-y-8">
            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {latestEntry ? (
                <div className={`p-8 rounded-[32px] border transition-all animate-fade-in ${LEVEL_METADATA[latestEntry.level].bgColor} border-current/5 shadow-sm relative overflow-hidden group hover:scale-[1.02]`}>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-3xl group-hover:bg-white/40 transition-all"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="text-[10px] font-extrabold text-slate-500/60 uppercase tracking-widest">Live Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border bg-white ${LEVEL_METADATA[latestEntry.level].color} border-current/10 shadow-sm`}>
                      {LEVEL_METADATA[latestEntry.level].label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 relative z-10">
                    <h3 className={`text-6xl font-black tracking-tighter ${LEVEL_METADATA[latestEntry.level].color}`}>
                      {latestEntry.value}
                    </h3>
                    <span className={`text-lg font-bold ${LEVEL_METADATA[latestEntry.level].color} opacity-40 uppercase`}>mg/dL</span>
                  </div>
                  <div className="mt-6 pt-6 border-t border-current/10 relative z-10">
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                      {LEVEL_METADATA[latestEntry.level].description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-100/50 border-2 border-slate-200/50 border-dashed rounded-[32px] flex flex-col items-center justify-center text-center">
                  <Activity className="text-slate-200 mb-3" size={32} />
                  <p className="text-slate-400 text-sm font-bold">Waiting for input...</p>
                </div>
              )}

              <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between">
                 <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] block mb-6">Metabolic Pulse</span>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-400">Avg. Sugar</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-800">
                            {entries.length > 0 ? Math.round(entries.reduce((acc, curr) => acc + curr.value, 0) / entries.length) : '--'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">MG</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{width: entries.length > 0 ? '70%' : '0%'}}></div>
                      </div>
                  </div>
                 </div>
                 <div className="mt-6 flex items-center gap-2 text-indigo-500">
                    <Zap size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">{entries.length} Logs recorded</span>
                 </div>
              </div>
            </div>

            {/* AI Insights Display */}
            {aiInsight && (
              <div className="bg-[#1E293B] p-8 rounded-[32px] relative shadow-2xl shadow-slate-200 overflow-hidden animate-fade-in group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
                   <BrainCircuit size={160} className="text-white" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white tracking-tight">Personal Health Advisor</h4>
                    <p className="text-[10px] text-indigo-300/60 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                  </div>
                </div>
                <div className="text-sm text-slate-300 space-y-4 leading-relaxed relative z-10 pr-4">
                  {aiInsight.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('#') ? 'font-bold text-white text-lg mt-6' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
                <button 
                  onClick={() => setAiInsight(null)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Charts & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <GlucoseChart entries={entries} />
          </div>
          <div className="lg:col-span-4">
            <HistoryList entries={entries} onDelete={deleteEntry} />
          </div>
        </div>

      </main>

      <footer className="max-w-6xl mx-auto px-6 mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full border border-rose-100 mb-6">
            <ShieldAlert size={14} className="text-rose-500" />
            <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">Medical Disclaimer</span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium italic">
            GlucoTrack AI is for informational purposes and data organization. It is not a diagnostic tool. Always prioritize professional medical consultation for diabetes management.
          </p>
          <div className="mt-12 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            &copy; 2025 GLUCOTRACK AI SYSTEMS
          </div>
      </footer>
    </div>
  );
};

export default App;