import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlucoseEntry } from '../types';

interface GlucoseChartProps {
  entries: GlucoseEntry[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ entries }) => {
  const data = entries.map(e => ({
    time: e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: e.value,
  })).slice(-10);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center h-[300px]">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Trend Data</p>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Metabolic Trend</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Last 10 Measurements</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            domain={[40, 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
            itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
            labelStyle={{ fontSize: '10px', fontWeight: 'black', color: '#64748b', marginBottom: '4px' }}
          />
          <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#6366f1" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#chartGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};