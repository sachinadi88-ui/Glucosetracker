import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Defs, LinearGradient, Stop } from 'recharts';
import { GlucoseEntry } from '../types';

interface GlucoseChartProps {
  entries: GlucoseEntry[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ entries }) => {
  const data = entries.map(e => ({
    time: e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: e.value,
    fullDate: e.timestamp.toLocaleString()
  })).slice(-15);

  if (entries.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-slate-400 font-medium">No readings tracked yet.</p>
        <p className="text-slate-300 text-sm mt-1">Start by adding your first blood sugar level.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-[400px] animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Glucose Trend</h2>
          <p className="text-xs text-slate-400 font-medium">Historical performance (Last 15 readings)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Current</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
            domain={[40, 'auto']}
          />
          <Tooltip 
            cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', padding: '12px 16px' }}
            itemStyle={{ color: '#1e293b', fontWeight: 700, fontSize: '14px' }}
            labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 800 }}
          />
          <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="6 6" strokeWidth={1} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="6 6" strokeWidth={1} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};