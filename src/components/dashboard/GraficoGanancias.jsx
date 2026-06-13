import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function GraficoGanancias({ data }) {
  return (
    <div className="bg-white/40 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/40 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Ganancias Mensuales (S/)</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-zinc-500 font-mono">Últimos 6 meses</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGanancias" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(226,232,240,0.5)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
              labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              className="dark:[&>.recharts-default-tooltip]:!bg-[#121016]/90 dark:[&>.recharts-default-tooltip]:!border-purple-950/80 dark:[&>.recharts-default-tooltip]:!backdrop-blur-md"
            />
            <Area 
              type="monotone" 
              dataKey="ganancias" 
              stroke="#a855f7" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorGanancias)" 
              dot={{ stroke: '#a855f7', strokeWidth: 2, r: 4, fill: '#121016' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}