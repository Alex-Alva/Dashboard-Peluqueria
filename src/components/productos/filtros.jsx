import React from 'react';
import { Search, Clock, ToggleLeft, RotateCcw, ChevronDown, DollarSign } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {

  const selectClasses = `
    appearance-none bg-white dark:bg-[#121016]/60
    backdrop-blur-md
    pl-10 pr-10 py-3 
    border border-purple-950/20 dark:border-purple-950/40 
    rounded-xl text-sm 
    text-slate-900 dark:text-gray-200 
    hover:border-purple-600/40 dark:hover:bg-[#121016]/80 
    focus:ring-4 focus:ring-purple-600/10 focus:border-purple-600
    outline-none transition-all cursor-pointer w-full
  `;

  const labelClasses = `
    text-[10px] uppercase font-bold tracking-widest mb-1.5 block
    text-purple-700 dark:text-purple-400
  `;

  return (
    <div className="w-full flex flex-wrap items-end gap-4 p-5 rounded-b-3xl 
                    bg-white dark:bg-[#121016] 
                    border-x border-b border-purple-950/20 dark:border-purple-950/40
                    transition-colors duration-200">

      <div className="relative flex-grow max-w-xs min-w-[240px]">
        <label className={labelClasses}>Buscar</label>
        <span className="absolute left-3.5 top-[39px] text-slate-600 dark:text-purple-400/60 pointer-events-none">
          <Search size={18} />
        </span>
        <input 
          type="text"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          placeholder="Nombre del servicio..." 
          className="w-full bg-white dark:bg-[#121016]/60 backdrop-blur-md border border-purple-950/20 dark:border-purple-950/40 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-gray-200 placeholder-slate-600 dark:placeholder-purple-900/50 focus:ring-4 focus:ring-purple-600/10 focus:border-purple-600 outline-none transition-all"
        />
      </div>

      <div className="relative flex-grow md:flex-grow-0 min-w-[120px] max-w-[140px]">
        <label className={labelClasses}>Stock ≤</label>
        <span className="absolute left-3.5 top-[39px] text-slate-600 dark:text-purple-400/60 pointer-events-none">
          <Clock size={18} />
        </span>
        <input 
          type="number"
          min="0"
          value={filters.stock}
          onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
          placeholder="Ej: 10" 
          className="w-full bg-white dark:bg-[#121016]/60 backdrop-blur-md border border-purple-950/20 dark:border-purple-950/40 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-gray-200 placeholder-slate-600 dark:placeholder-purple-900/50 focus:ring-4 focus:ring-purple-600/10 focus:border-purple-600 outline-none transition-all"
        />
      </div>

      <div className="relative flex-grow md:flex-grow-0 min-w-[150px]">
        <label className={labelClasses}>Precio</label>
        <span className="absolute left-3.5 top-[39px] text-slate-600 dark:text-purple-400/60 pointer-events-none">
          <DollarSign size={18} />
        </span>
        <select 
          value={filters.precio}
          onChange={(e) => setFilters({ ...filters, precio: e.target.value })}
          className={selectClasses}
        >
          <option value="">Todos</option>
          <option value="0-20">Hasta S/ 20</option>
          <option value="20-50">S/ 20 - S/ 50</option>
          <option value="50-100">S/ 50 - S/ 100</option>
          <option value="100-200">S/ 100 - S/ 200</option>
          <option value="300+">Más de S/ 300</option>
        </select>
        <span className="absolute right-3.5 top-[39px] text-slate-600 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      <div className="relative flex-grow md:flex-grow-0 min-w-[130px]">
        <label className={labelClasses}>Estado</label>
        <span className="absolute left-3.5 top-[39px] text-slate-600 dark:text-purple-400/60 pointer-events-none">
          <ToggleLeft size={18} />
        </span>
        <select 
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          className={selectClasses}
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <span className="absolute right-3.5 top-[39px] text-slate-600 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      <button 
        onClick={() => setFilters({ nombre: '', stock: '', precio: '', estado: '' })}
        className="flex items-center justify-center gap-2 px-5 py-3 border border-purple-600/30 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-600/10 active:scale-95 transition-all ml-auto w-full sm:w-auto"
      >
        <RotateCcw size={18} />
        <span>Limpiar</span>
      </button>

    </div>
  );
};

export default FilterBar;