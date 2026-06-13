import React, { useState } from 'react';
import { PlusCircle, Copy, History, ChevronDown, Check } from 'lucide-react';

export default function HeaderActions({ ventas, ventaActivaId, setVentaActivaId, onNueva, onDuplicar }) {
  const [isOpen, setIsOpen] = useState(false);
  const ventaActual = ventas.find(v => v.id === ventaActivaId);

  return (
    <header className="w-full bg-white dark:bg-[#121016] border-b border-slate-200 dark:border-purple-950/40 px-6 py-3 transition-colors duration-200 relative z-30">
      <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Venta activa:</span>
          <span className="text-sm font-semibold bg-purple-600/10 dark:bg-purple-400/10 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-md border border-purple-200/40 dark:border-purple-900/30">
            {ventaActual?.nombre}
          </span>
        </div>

        <div className="flex items-center gap-3 relative">
          <button onClick={onNueva} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-purple-950/40 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-purple-950/30 transition-all font-medium text-xs">
            <PlusCircle size={15} className="text-purple-600 dark:text-purple-400" />
            <span>Nueva venta</span>
          </button>

          <button onClick={onDuplicar} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-purple-950/40 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-purple-950/30 transition-all font-medium text-xs">
            <Copy size={15} className="text-indigo-500" />
            <span>Duplicar</span>
          </button>

          {/* Dropdown de Ventas Pendientes */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:opacity-95 transition-opacity font-semibold text-xs group shadow-md shadow-purple-600/10"
            >
              <History size={15} />
              <span>Historial ({ventas.length})</span>
              <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/60 rounded-xl shadow-2xl z-50 overflow-hidden block">
                {ventas.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setVentaActivaId(v.id); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-purple-600/10 dark:hover:bg-purple-400/10 transition-colors ${v.id === ventaActivaId ? 'text-purple-600 dark:text-purple-400 font-semibold bg-purple-600/5 dark:bg-purple-400/5' : 'text-slate-600 dark:text-zinc-400'}`}
                  >
                    <span>{v.nombre}</span>
                    {v.id === ventaActivaId && <Check size={14} className="text-purple-600 dark:text-purple-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}