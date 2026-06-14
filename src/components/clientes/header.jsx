import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const ClientesHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121016]/80 dark:backdrop-blur-md p-5 rounded-2xl border border-slate-200 dark:border-purple-950/40 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <ClipboardList size={16} />
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-purple-300">
            Gestión de Clientes
          </h2>
        </div>
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:brightness-110 active:scale-[0.98]"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Nuevo Cliente</span>
        </button>

      </div>
    </div>
  );
};

export default ClientesHeader;