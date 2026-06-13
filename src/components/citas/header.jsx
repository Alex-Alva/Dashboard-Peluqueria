import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const CitasHeader = ({ onOpenForm }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121016] p-4 rounded-t-xl border-x border-t border-gray-200 dark:border-purple-950/40 transition-colors duration-200">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <ClipboardList className="text-gray-400" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase dark:text-gray-200">
            Citas
          </h2>
        </div>

        <button 
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-all font-medium text-xs"
        >
          <Plus size={16} className="text-purple-600 dark:text-purple-400" />
          <span>Nueva Cita</span>
        </button>

      </div>
    </div>
  );
};

export default CitasHeader;