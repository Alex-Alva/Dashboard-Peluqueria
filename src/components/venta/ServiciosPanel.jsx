import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Clock, Plus, Check } from 'lucide-react';

export default function ServiciosPanel({ agregarAlCarrito, ventaActual, mockServicios }) {
  const [busqueda, setBusqueda] = useState('');

  const serviciosFiltrados = mockServicios.filter(s =>
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <motion.div 
      key="servicios" 
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -10 }} 
      transition={{ duration: 0.15 }}
      className="flex flex-col h-full bg-white dark:bg-[#121016]"
    >
      <div className="p-4 border-b border-gray-100 dark:border-purple-950/30 flex items-center gap-2 font-bold text-xs uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
        <Scissors size={14} /> <span>Servicios disponibles</span>
      </div>
      <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
        <input 
          type="text" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar servicio..." 
          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#121016]/40 border border-slate-200 dark:border-purple-950/50 rounded-lg text-xs outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors text-slate-800 dark:text-zinc-100 placeholder-slate-400" 
        />
        <div className="flex flex-col gap-2">
          {serviciosFiltrados.map(s => {
            const itemEnCarrito = ventaActual.items.find(i => i.id === s.id);

            return (
              <div key={s.id} className="p-3 bg-white dark:bg-[#121016]/30 border border-slate-100 dark:border-purple-950/40 rounded-xl flex justify-between items-center hover:border-slate-200 dark:hover:border-purple-950/80 transition-all">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{s.nombre}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                    <Clock size={10} /> <span>{s.tiempo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">S/ {s.precio.toFixed(2)}</span>
                  
                  {itemEnCarrito ? (
                    <div 
                      className="p-1.5 rounded-lg bg-slate-100/70 dark:bg-purple-950/20 text-slate-400 dark:text-purple-950/60 border border-slate-200/30 dark:border-purple-950/30 cursor-not-allowed"
                      title="Este servicio ya fue agregado al detalle"
                    >
                      <Check size={14} />
                    </div>
                  ) : (
                    <button 
                      onClick={() => agregarAlCarrito(s, 'Servicio')} 
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-purple-950/40 text-slate-800 dark:text-zinc-200 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-zinc-950 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}