import React from 'react';
import { Search, Clock, ToggleLeft, RotateCcw, ChevronDown, DollarSign } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {

  const selectClasses = `
    appearance-none bg-white dark:bg-[#121016]/60 backdrop-blur-md
    pl-10 pr-10 py-3 
    border border-purple-500/20 dark:border-purple-950/40 
    rounded-xl text-sm 
    text-slate-800 dark:text-gray-200 
    hover:border-purple-500/40 dark:hover:bg-[#121016]/80 
    focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600
    outline-none transition-all cursor-pointer w-full
  `;

  const labelClasses = `
    text-[10px] uppercase font-bold tracking-widest mb-1.5 block
    text-purple-700 dark:text-purple-400
  `;

  return (
    <div className="w-full flex flex-wrap items-end gap-4 p-5 rounded-b-3xl 
                    bg-slate-50 dark:bg-[#121016]/80 backdrop-blur-md
                    border-x border-b border-purple-500/20
                    transition-colors duration-200">

      {/* BUSCADOR */}
      <div className="relative flex-grow max-w-xs min-w-[240px]">
        <label className={labelClasses}>Buscar</label>
        <span className="absolute left-3.5 top-[39px] text-slate-400 dark:text-purple-500/40 pointer-events-none">
          <Search size={18} />
        </span>
        <input 
          type="text"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          placeholder="Nombre del servicio..." 
          className="w-full bg-white dark:bg-[#121016]/60 backdrop-blur-md border border-purple-500/20 dark:border-purple-950/40 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-zinc-600 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 outline-none transition-all"
        />
      </div>

      {/* DURACIÓN */}
      <div className="relative flex-grow md:flex-grow-0 min-w-[140px]">
        <label className={labelClasses}>Duración</label>
        <span className="absolute left-3.5 top-[39px] text-slate-400 dark:text-purple-500/40 pointer-events-none">
          <Clock size={18} />
        </span>
        <select 
          value={filters.duracion}
          onChange={(e) => setFilters({ ...filters, duracion: e.target.value })}
          className={selectClasses}
        >
          <option value="">Todas</option>
          <option value="0-30">0 - 30 min</option>
          <option value="31-60">31 - 60 min</option>
          <option value="61-120">1h - 2h</option>
          <option value="120+">Más de 2h</option>
        </select>
        <span className="absolute right-3.5 top-[39px] text-gray-400 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* PRECIO */}
      <div className="relative flex-grow md:flex-grow-0 min-w-[150px]">
        <label className={labelClasses}>Precio</label>
        <span className="absolute left-3.5 top-[39px] text-slate-400 dark:text-purple-500/40 pointer-events-none">
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
          <option value="100+">Más de S/ 100</option>
        </select>
        <span className="absolute right-3.5 top-[39px] text-gray-400 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* ESTADO */}
      <div className="relative flex-grow md:flex-grow-0 min-w-[130px]">
        <label className={labelClasses}>Estado</label>
        <span className="absolute left-3.5 top-[39px] text-slate-400 dark:text-purple-500/40 pointer-events-none">
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
        <span className="absolute right-3.5 top-[39px] text-gray-400 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* LIMPIAR FILTROS */}
      <button 
        onClick={() => setFilters({ nombre: '', duracion: '', precio: '', estado: '' })}
        className="flex items-center justify-center gap-2 px-5 py-3 border border-purple-500/30 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 active:scale-95 transition-all ml-auto w-full sm:w-auto"
      >
        <RotateCcw size={18} />
        <span>Limpiar</span>
      </button>

    </div>
  );
};

export default FilterBar;