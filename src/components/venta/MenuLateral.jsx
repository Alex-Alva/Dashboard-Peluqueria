import React from 'react';
import { Sidebar } from 'lucide-react'; 

export default function MenuLateral({ menuActivo, setMenuActivo, opciones }) {
  return (
    <div className="w-16 bg-white dark:bg-[#121016]/40 border-r border-slate-200 dark:border-purple-950/40 flex flex-col justify-between items-center py-4 z-30 backdrop-blur-md">
      
      {/* Grupo superior de botones de navegación */}
      <div className="flex flex-col items-center gap-3 w-full">
        {opciones.map(btn => {
          const Icon = btn.icon;
          const activo = menuActivo === btn.id;
          
          return (
            <button 
              key={btn.id}
              onClick={() => setMenuActivo(activo ? null : btn.id)}
              className={`p-3 rounded-xl transition-all ${activo ? 'bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 scale-105 shadow-sm border border-purple-600/10 dark:border-purple-400/10' : 'text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-purple-950/30 hover:text-slate-600 dark:hover:text-zinc-200'}`}
              title={activo ? `Ocultar ${btn.label}` : btn.label}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {/* Botón inferior maestro */}
      <div className="w-full pt-4 border-t border-slate-100 dark:border-purple-950/20 flex justify-center">
        <button
          onClick={() => setMenuActivo(menuActivo ? null : 'cliente')}
          className={`p-3 rounded-xl transition-all ${!menuActivo ? 'bg-slate-100 dark:bg-purple-950/40 text-slate-400 dark:text-zinc-500' : 'text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400'}`}
          title={menuActivo ? "Ocultar panel lateral" : "Mostrar panel lateral"}
        >
          <Sidebar size={20} className={`transition-transform duration-200 ${!menuActivo ? 'rotate-180 text-purple-600 dark:text-purple-400' : ''}`} />
        </button>
      </div>

    </div>
  );
}