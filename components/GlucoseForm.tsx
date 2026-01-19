
import React, { useState } from 'react';
import { MealStatus, GlucoseEntry, GlucoseLevel } from '../types';
import { getGlucoseLevel } from '../constants';

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
      id: Math.random().toString(36).substr(2, 9),
      value: glucoseValue,
      timestamp: new Date(),
      mealStatus: status,
      level: level
    };

    onAddEntry(newEntry);
    setValue('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Add New Reading</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Glucose Value (mg/dL)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., 95"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
            min="1"
            max="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Reading Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(MealStatus) as Array<keyof typeof MealStatus>).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(MealStatus[s])}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                  status === MealStatus[s]
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-300'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-blue-100"
        >
          Track Reading
        </button>
      </form>
    </div>
  );
};
