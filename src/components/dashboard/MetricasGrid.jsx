import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export default function MetricasGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* KPI 1: Tiempo promedio */}
      <div className="bg-gradient-to-br from-purple-600/10 via-transparent to-transparent dark:from-purple-400/10 dark:to-transparent border border-purple-600/20 dark:border-purple-400/20 rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden backdrop-blur-md">
        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 tracking-wider uppercase">Tiempo Prom. Servicio</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">45</span>
          <span className="text-sm font-medium text-slate-500 dark:text-zinc-400">min</span>
        </div>
        <Clock className="absolute right-4 bottom-4 text-purple-600/10 dark:text-purple-400/10" size={40} />
      </div>

      {/* KPI 2: Eficiencia de citas */}
      <div className="bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent dark:from-indigo-400/10 dark:to-transparent border border-indigo-600/20 dark:border-indigo-400/20 rounded-2xl p-4 flex flex-col justify-between h-28 relative overflow-hidden backdrop-blur-md">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">Citas Concluidas</span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">92.4%</span>
        </div>
        <CheckCircle className="absolute right-4 bottom-4 text-indigo-600/10 dark:text-indigo-400/10" size={40} />
      </div>

      {/* KPI 3: Contadores Rápidos */}
      <div className="bg-white/40 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/40 rounded-2xl p-4 flex flex-col justify-center gap-3 h-28 backdrop-blur-md">
        <div className="flex justify-between items-center bg-slate-100/60 dark:bg-purple-950/20 p-2 rounded-xl border border-slate-200/40 dark:border-purple-950/30">
          <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Nuevos Clientes</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">-2.4%</span>
        </div>
        <div className="flex justify-between items-center bg-slate-100/60 dark:bg-purple-950/20 p-2 rounded-xl border border-slate-200/40 dark:border-purple-950/30">
          <span className="text-xs text-slate-600 dark:text-zinc-400 font-medium">Citas Online</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">+23%</span>
        </div>
      </div>
    </div>
  );
}