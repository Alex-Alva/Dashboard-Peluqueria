import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendario = ({ selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const primerDia = new Date(year, month, 1).getDay();
  const diasEnMes = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dias = [];
  for (let i = 0; i < primerDia; i++) {
    dias.push(null);
  }
  for (let i = 1; i <= diasEnMes; i++) {
    dias.push(i);
  }

  return (
    <div className="bg-white dark:bg-[#121016] p-4 rounded-xl shadow-xl w-80 border border-gray-200 dark:border-purple-950/40">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-950/40 text-gray-600 dark:text-zinc-400 transition"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="font-semibold text-sm dark:text-zinc-200">
          {meses[month]} {year}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-purple-950/40 text-gray-600 dark:text-zinc-400 transition"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* DÍAS SEMANA */}
      <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {diasSemana.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* DÍAS */}
      <div className="grid grid-cols-7 text-center text-sm gap-1">
        {dias.map((d, index) => {
          if (!d) {
            return <div key={index} className="p-2" />;
          }

          const isSelected =
            selectedDate.getDate() === d &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          return (
            <button
              key={index}
              onClick={() => onSelectDate(new Date(year, month, d))}
              className={`p-2 rounded-lg transition font-medium text-xs ${
                isSelected
                  ? "bg-gradient-to-br from-purple-700 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20"
                  : "text-gray-700 dark:text-zinc-300 hover:bg-purple-500/10 dark:hover:bg-purple-950/50"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendario;