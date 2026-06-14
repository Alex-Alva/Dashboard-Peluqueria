import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';

export default function CitasPendientes({ citas }) {
  return (
    <div className="bg-white/40 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/40 rounded-2xl p-4 flex flex-col gap-4 max-h-[85vh] overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-md">
      <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-purple-950/40">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-600 dark:text-purple-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">Citas Pendientes</h3>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-600/10 dark:bg-purple-400/20 text-purple-600 dark:text-purple-400">
          {citas.length} hoy
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 scrollbar-thin">
        {citas.map((cita) => (
          <div 
            key={cita.id} 
            className="p-3 bg-slate-100/50 dark:bg-purple-950/20 rounded-xl border border-slate-200/40 dark:border-purple-950/30 hover:bg-white/60 dark:hover:bg-purple-950/40 hover:border-slate-300 dark:hover:border-purple-900/60 transition-all duration-200 flex flex-col gap-2 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-200/60 dark:bg-purple-950/50 text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-white transition">
                  <User size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{cita.cliente}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">{cita.servicio}</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold bg-purple-600/10 dark:bg-purple-400/10 px-2 py-0.5 rounded-lg text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Clock size={11} /> {cita.hora}
              </span>
            </div>

            <div className="flex justify-end items-center mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                cita.estado === 'En espera' 
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' 
                  : cita.estado === 'Próximo'
                  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  : 'bg-slate-200/60 dark:bg-purple-950/60 text-slate-600 dark:text-zinc-400'
              }`}>
                {cita.estado}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all mt-2 shadow-md shadow-purple-600/10">
        Ver Agenda Completa
      </button>
    </div>
  );
}