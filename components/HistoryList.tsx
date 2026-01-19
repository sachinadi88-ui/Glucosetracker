
import React from 'react';
import { GlucoseEntry } from '../types';
import { LEVEL_METADATA } from '../constants';

interface HistoryListProps {
  entries: GlucoseEntry[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete }) => {
  const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-semibold text-slate-800">Reading History</h2>
        <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-full border border-slate-200">
          {entries.length} readings
        </span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {sortedEntries.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            No history recorded yet
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedEntries.map((entry) => {
              const meta = LEVEL_METADATA[entry.level];
              return (
                <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${meta.bgColor} ${meta.color}`}>
                        {entry.value}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                            {entry.mealStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {entry.timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Delete entry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
