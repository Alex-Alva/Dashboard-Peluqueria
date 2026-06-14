import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const AgendaHeader = ({ weekRange, onPrevWeek, onNextWeek, onToggleCalendar }) => {
  return (
    <div className="flex items-center justify-between mb-4 bg-white dark:bg-[#121016] p-3 rounded-xl border border-gray-200 dark:border-purple-950/40 shadow-sm transition-colors">
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevWeek}
          className="p-2 hover:bg-gray-100 dark:hover:bg-purple-950/30 text-gray-600 dark:text-zinc-300 rounded-lg border border-gray-200 dark:border-purple-950/40 transition"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-100 dark:hover:bg-purple-950/30 text-gray-600 dark:text-zinc-300 rounded-lg border border-gray-200 dark:border-purple-950/40 transition"
        >
          <ChevronRight size={18} />
        </button>
        <div className="px-4 py-1.5 border border-gray-200 dark:border-purple-950/40 rounded-lg text-xs font-bold dark:text-zinc-200 uppercase tracking-wider bg-gray-50 dark:bg-[#121016]">
          {weekRange}
        </div>
      </div>
      <button
        onClick={onToggleCalendar}
        className="flex items-center gap-2 px-4 py-1.5 border border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-500/10 text-xs font-semibold tracking-wide uppercase transition-all"
      >
        <Calendar size={14} className="text-purple-600 dark:text-purple-400" />
        <span>Calendario</span>
      </button>
    </div>
  );
};

export default AgendaHeader;