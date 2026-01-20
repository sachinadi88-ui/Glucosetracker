import React, { useState } from 'react';
import { MealStatus, GlucoseEntry } from '../types';
import { getGlucoseLevel } from '../constants';
import { Plus, ChevronRight, Hash } from 'lucide-react';

interface GlucoseFormProps {
  onAddEntry: (entry: GlucoseEntry) => void;
}

export const GlucoseForm: React.FC<GlucoseFormProps> = ({ onAddEntry }) => {
  const [value, setValue] = useState<string>('');
  const [status, setStatus] = useState<MealStatus>(MealStatus.FASTING);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const glucoseValue = parseFloat(value);
    if (isNaN(glucoseValue) || glucoseValue <= 0) return;

    const level = getGlucoseLevel(glucoseValue, status);
    const newEntry: GlucoseEntry = {
      id: Math.random().toString(36).substring(2, 11),
      value: glucoseValue,
      timestamp: new Date(),
      mealStatus: status,
      level: level
    };

    onAddEntry(newEntry);
    setValue('');
  };

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 ring-1 ring-slate-100 relative">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl">
          <Plus size={22} />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">New Log</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entry Panel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Measurement (mg/dL)
          </label>
          <div className="group relative">
             <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="000"
              className="w-full pl-6 pr-20 py-6 bg-slate-50 border-2 border-slate-50 rounded-2xl text-4xl font-black text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 focus:shadow-inner outline-none transition-all placeholder:text-slate-200"
              required
              min="1"
              max="999"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">mg</span>
              <div className="h-px w-4 bg-slate-200 my-0.5"></div>
              <span className="text-xs font-black text-slate-300 uppercase tracking-tighter">dL</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
            Temporal State
          </label>
          <div className="grid grid-cols-1 gap-3">
            {(Object.keys(MealStatus) as Array<keyof typeof MealStatus>).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(MealStatus[s])}
                className={`px-6 py-4 text-xs font-bold rounded-2xl border-2 transition-all flex items-center justify-between group ${
                  status === MealStatus[s]
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full ${status === MealStatus[s] ? 'bg-indigo-400' : 'bg-slate-200'}`}></div>
                   <span className="uppercase tracking-widest font-black text-[10px]">{s.replace('_', ' ')}</span>
                </div>
                <ChevronRight size={14} className={`${status === MealStatus[s] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'} transition-all`} />
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] group"
        >
          <span className="text-sm uppercase tracking-[0.2em]">Record Reading</span>
          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30">
            <Plus size={16} />
          </div>
        </button>
      </form>
    </div>
  );
};