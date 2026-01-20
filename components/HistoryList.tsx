import React from 'react';
import { GlucoseEntry } from '../types';
import { LEVEL_METADATA } from '../constants';
import { Trash2, Clock, Calendar } from 'lucide-react';

interface HistoryListProps {
  entries: GlucoseEntry[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h2 className="font-extrabold text-slate-900 tracking-tight">Timeline</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Audit Trail</p>
        </div>
        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter">
          {entries.length} Logs
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {sortedEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="text-slate-200" size={24} />
            </div>
            <p className="text-slate-300 text-sm font-bold uppercase tracking-widest">Awaiting Logs</p>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const meta = LEVEL_METADATA[entry.level];
            return (
              <div key={entry.id} className="p-5 bg-white hover:bg-slate-50 border border-slate-50 hover:border-slate-100 rounded-3xl transition-all group relative animate-fade-in shadow-sm hover:shadow-md">
                <div className="flex justify-between items-center">
                  <div className="flex gap-5 items-center">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${meta.bgColor} ${meta.color} shadow-inner`}>
                      <span className="text-xl font-black leading-none">{entry.value}</span>
                      <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">mg/dL</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${meta.color}`}>
                          {meta.label}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {entry.mealStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          <span className="text-[10px] font-bold">
                            {entry.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          <span className="text-[10px] font-bold">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                    title="Remove reading"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};