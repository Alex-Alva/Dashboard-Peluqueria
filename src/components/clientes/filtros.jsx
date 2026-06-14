import React from 'react';
import { Search, Clock, Box, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', frecuencia: '', visitas: '' });
  };

  return (
    <div className="w-full flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md transition-colors duration-300">
      <div className="relative flex-grow max-w-xs group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-400/50 group-focus-within:text-purple-500 transition-colors">
          <Search size={16} />
        </span>
        <input 
          name="search"
          value={filters.search}
          onChange={handleChange}
          type="text" 
          placeholder="Buscar cliente o número..." 
          className="w-full bg-transparent text-xs text-slate-900 dark:text-white border border-slate-200 dark:border-purple-950/40 rounded-xl py-2.5 pl-9 pr-4 outline-none focus:border-purple-500 dark:focus:border-purple-500 transition-all placeholder:text-slate-400 dark:placeholder:text-purple-400/30"
        />
      </div>
      <div className="relative group">
        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-400/50 group-focus-within:text-purple-500 transition-colors" size={16} />
        <select
          name="frecuencia"
          value={filters.frecuencia}
          onChange={handleChange}
          className="appearance-none text-xs font-medium text-slate-700 dark:text-purple-200 pl-9 pr-10 py-2.5 bg-transparent border border-slate-200 dark:border-purple-950/40 rounded-xl outline-none cursor-pointer focus:border-purple-500 dark:focus:border-purple-500 transition-all"
        >
          <option value="" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Frecuencia</option>
          <option value="Nuevo" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Nuevo</option>
          <option value="Regular" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Regular</option>
          <option value="Frecuente" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Frecuente</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-purple-400/40 rotate-45" />
      </div>

      <div className="relative group">
        <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-purple-400/50 group-focus-within:text-purple-500 transition-colors" size={16} />
        <select
          name="visitas"
          value={filters.filters}
          onChange={handleChange}
          className="appearance-none text-xs font-medium text-slate-700 dark:text-purple-200 pl-9 pr-10 py-2.5 bg-transparent border border-slate-200 dark:border-purple-950/40 rounded-xl outline-none cursor-pointer focus:border-purple-500 dark:focus:border-purple-500 transition-all"
        >
          <option value="" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Visitas</option>
          <option value="0-5" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Pocas (0-5)</option>
          <option value="5-15" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Regular (5-15)</option>
          <option value="15-25" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Frecuente (15-25)</option>
          <option value="25+" className="bg-white text-slate-900 dark:bg-[#121016] dark:text-purple-200">Más de 25</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-purple-400/40 rotate-45" />
      </div>
      <button 
        onClick={handleReset}
        className="flex items-center gap-2 px-4 py-2.5 ml-auto border border-slate-200 dark:border-purple-950/40 rounded-xl text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-purple-400 bg-slate-50 dark:bg-[#121016] hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200 shadow-sm"
      >
        <RotateCcw size={12} className="stroke-[2.5]" />
        <span>Limpiar</span>
      </button>
    </div>
  );
};

export default FilterBar;