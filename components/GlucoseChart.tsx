
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { GlucoseEntry } from '../types';

interface GlucoseChartProps {
  entries: GlucoseEntry[];
}

export const GlucoseChart: React.FC<GlucoseChartProps> = ({ entries }) => {
  const data = entries.map(e => ({
    time: e.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: e.value,
    fullDate: e.timestamp.toLocaleString()
  })).slice(-10);

  if (entries.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
        <p className="text-slate-400">No data to display yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Glucose Trend</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            domain={[40, 'auto']}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            labelStyle={{ fontWeight: 'bold' }}
          />
          <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'Target Max', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Low', position: 'right', fill: '#ef4444', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
