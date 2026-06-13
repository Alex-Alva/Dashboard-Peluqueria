import React from 'react';

const AgendaBody = ({ days, hours, appointments, onSelectCita }) => {
  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-[#121016] rounded-xl border border-gray-200 dark:border-purple-950/40 custom-scrollbar">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] min-w-[1000px]">
        
        {/* ESQUINA */}
        <div className="sticky top-0 left-0 bg-white dark:bg-[#121016] border-b border-r border-gray-200 dark:border-purple-950/40 z-20" />

        {/* CABECERA DÍAS */}
        {days.map((day, i) => (
          <div
            key={i}
            className="sticky top-0 bg-gray-50 dark:bg-[#121016] border-b border-r border-gray-200 dark:border-purple-950/40 p-3 text-center z-10"
          >
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              {day.day}
            </span>
            <span className="block font-bold text-gray-800 dark:text-zinc-200 text-lg">
              {day.date}
            </span>
          </div>
        ))}

        {/* HORAS */}
        {hours.map((hour) => {
          const hourNumber = Number(hour.split(':')[0]);

          return (
            <React.Fragment key={hour}>
              
              {/* ETIQUETA HORA */}
              <div className="border-b border-r border-gray-200 dark:border-purple-950/40 p-4 text-xs font-medium text-gray-400 sticky left-0 bg-white dark:bg-[#121016] z-10">
                {hour}
              </div>

              {/* COLUMNAS DÍA */}
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-b border-r border-gray-200 dark:border-purple-950/40 relative h-20 hover:bg-purple-500/5 dark:hover:bg-purple-950/10 transition-colors"
                >
                  {appointments
                    .filter(app => {
                      const appDate = app.start;
                      const sameDay = appDate.toDateString() === day.fullDate.toDateString();
                      const sameHour = appDate.getHours() === hourNumber;
                      return sameDay && sameHour;
                    })
                    .map((app) => (
                      <div
                        key={app.id}
                        onClick={() => onSelectCita(app)}
                        className={`absolute inset-x-1 top-1 p-2 rounded-lg border-l-4 z-0 cursor-pointer hover:scale-[1.02] transition-transform ${app.color}`}
                      >
                        <p className="text-[10px] opacity-90 font-medium">
                          {new Date(app.start).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(app.end).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="font-bold text-xs truncate">
                          {app.title}
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaBody;