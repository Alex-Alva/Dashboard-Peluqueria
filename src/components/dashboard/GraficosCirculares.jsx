import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Sparkles } from 'lucide-react';

export default function GraficosCirculares({ productos, servicios, isDark }) {
  // Paletas basadas en morados, lilas y grises azulados/oscuros
  const COLORES_PRODUCTOS = isDark ? ['#a855f7', '#6366f1', '#1e1b4b'] : ['#8b5cf6', '#4f46e5', '#cbd5e1'];
  const COLORES_SERVICIOS = ['#d946ef', '#a855f7', '#4f46e5'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Donut 1: Productos Más Vendidos */}
      <div className="bg-white/40 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/40 rounded-2xl p-4 flex flex-col items-center backdrop-blur-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 self-start mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-purple-600 dark:text-purple-400" /> Productos Más Vendidos
        </h4>
        <div className="h-44 w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={productos} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                {productos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORES_PRODUCTOS[index % COLORES_PRODUCTOS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(18,16,22,0.8)' : 'rgba(255,255,255,0.8)', borderRadius: '8px', border: 'none', backdropFilter: 'blur(4px)' }} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Donut 2: Servicios Más Realizados */}
      <div className="bg-white/40 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/40 rounded-2xl p-4 flex flex-col items-center backdrop-blur-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 self-start mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-fuchsia-500 dark:text-fuchsia-400" /> Servicios Solicitados
        </h4>
        <div className="h-44 w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={servicios} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                {servicios.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORES_SERVICIOS[index % COLORES_SERVICIOS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? 'rgba(18,16,22,0.8)' : 'rgba(255,255,255,0.8)', borderRadius: '8px', border: 'none', backdropFilter: 'blur(4px)' }} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}