import React, { useState, useEffect } from 'react';
import { GlucoseEntry } from './types';
import { GlucoseForm } from './components/GlucoseForm';
import { GlucoseChart } from './components/GlucoseChart';
import { HistoryList } from './components/HistoryList';
import { getGlucoseInsights } from './services/geminiService';
import { LEVEL_METADATA } from './constants';
import { Activity, Trash2, Sparkles, BrainCircuit, Zap, ShieldAlert } from 'lucide-react';

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
    if (window.confirm('Clear all logs? This cannot be undone.')) {
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
      setAiInsight("Unable to connect to AI advisor. Please check your API key and connection.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Header */}
      <header className="glass sticky top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Activity size={22} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">GlucoTrack AI</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider mt-1">Metabolic Pulse</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {entries.length > 0 && (
              <button 
                onClick={clearAll}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                title="Reset data"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button 
              onClick={generateInsights}
              disabled={entries.length === 0 || isInsightLoading}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all disabled:opacity-20 disabled:cursor-not-allowed shadow-md"
            >
              <Sparkles size={16} className={isInsightLoading ? 'animate-pulse' : ''} />
              {isInsightLoading ? 'Thinking...' : 'AI Advice'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form and Stats */}
          <div className="lg:col-span-4 space-y-8">
            <GlucoseForm onAddEntry={addEntry} />
            
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Stats</span>
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                  <Zap size={18} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {entries.length > 0 ? Math.round(entries.reduce((acc, curr) => acc + curr.value, 0) / entries.length) : '--'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Avg mg/dL</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: entries.length > 0 ? '65%' : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Status and AI Insight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestEntry ? (
                <div className={`p-6 rounded-3xl border ${LEVEL_METADATA[latestEntry.level].bgColor} border-current/5 shadow-sm relative overflow-hidden`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Latest Reading</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white ${LEVEL_METADATA[latestEntry.level].color} border border-current/10`}>
                      {LEVEL_METADATA[latestEntry.level].label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-black ${LEVEL_METADATA[latestEntry.level].color}`}>{latestEntry.value}</span>
                    <span className={`text-sm font-bold ${LEVEL_METADATA[latestEntry.level].color} opacity-50`}>mg/dL</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-4 leading-relaxed">
                    {LEVEL_METADATA[latestEntry.level].description}
                  </p>
                </div>
              ) : (
                <div className="p-6 bg-slate-100/50 border-2 border-slate-200/30 border-dashed rounded-3xl flex flex-col items-center justify-center text-center">
                  <Activity className="text-slate-300 mb-2" size={32} />
                  <p className="text-sm font-bold text-slate-400">Waiting for data...</p>
                </div>
              )}

              {aiInsight ? (
                <div className="bg-slate-900 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit size={100} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Advisor Insight</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed max-h-[120px] overflow-y-auto pr-2">
                    {aiInsight.split('\n').map((line, i) => (
                      <p key={i} className="mb-2">{line}</p>
                    ))}
                  </div>
                  <button onClick={() => setAiInsight(null)} className="mt-3 text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider">Dismiss</button>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group" onClick={generateInsights}>
                  <BrainCircuit className="text-slate-200 group-hover:text-indigo-500 transition-colors mb-2" size={32} />
                  <p className="text-xs font-bold text-slate-400">Request AI Insight</p>
                </div>
              )}
            </div>

            {/* Trends Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <GlucoseChart entries={entries} />
            </div>

            {/* Logs Timeline */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
              <HistoryList entries={entries} onDelete={deleteEntry} />
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-full border border-rose-100 mb-4">
          <ShieldAlert size={14} className="text-rose-500" />
          <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest">Medical Info</span>
        </div>
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
          GlucoTrack AI is for reference only. Do not make medical decisions based on this app. Always consult with a licensed healthcare professional.
        </p>
        <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">&copy; 2025 GLUCOTRACKER by SACHIN ADI</p>
      </footer>
    </div>
  );
};

export default App;