import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const ServicesHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-[#121016]/80 backdrop-blur-md p-5 rounded-t-3xl border-x border-t border-purple-500/20 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        {/* TÍTULO */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <ClipboardList className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-900 dark:text-gray-200">
            Módulo de Servicios
          </h2>
        </div>

        {/* BOTÓN NUEVO SERVICIO */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-xs shadow-lg shadow-purple-500/10"
        >
          <Plus size={16} className="text-white stroke-[3]" />
          <span>Nuevo servicio</span>
        </button>

      </div>
    </div>
  );
};

export default ServicesHeader;