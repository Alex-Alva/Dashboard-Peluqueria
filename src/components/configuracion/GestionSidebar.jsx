import React from 'react';
import { Eye, ChevronUp, ChevronDown } from 'lucide-react';

export default function GestionSidebar({ menuItems, moverItemArriba, moverItemAbajo }) {
  return (
    <div className="bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Eye className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Orden del Menú Lateral
        </h2>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-950/40 rounded-lg"
          >
            <span className="text-2xl">{item.icono}</span>
            <span className="flex-1 font-medium text-slate-900 dark:text-white">
              {item.nombre}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => moverItemArriba(index)}
                disabled={index === 0}
                className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Mover arriba"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={() => moverItemAbajo(index)}
                disabled={index === menuItems.length - 1}
                className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                title="Mover abajo"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
