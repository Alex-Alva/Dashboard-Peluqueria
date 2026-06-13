import React, { useState } from 'react';
import { Landmark, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Importación de los componentes hijos basados en la estructura financiera
import CierreCaja from '../components/finanzas/cierredecaja/cierreCaja';
import Egresos from '../components/finanzas/egresos/egresos'; 
import Ingresos from '../components/finanzas/ingresos/ingresos'; 

export default function FinanzasGeneral() {
  // Inicializa con 'cierre' para que sea la primera vista en renderizarse
  const [activeTab, setActiveTab] = useState('cierre');
  
  // Filtros globales compartidos opcionales en caso de que tus hijos los requieran
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('Todos');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121016] p-8 text-slate-800 dark:text-purple-100/90 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-slate-900 dark:text-white">
          Gestión Financiera <span className="text-purple-600 dark:text-purple-500">|</span>
        </h1>
        <p className="text-[10px] text-slate-500 dark:text-purple-400/60 mt-2 tracking-widest uppercase opacity-80">
          Control de caja, flujo de ingresos y egresos de la peluquería
        </p>
      </header>

      {/* PESTAÑAS (TABS) */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-purple-950/40 mb-8 gap-1">
        {[
          { id: 'cierre', label: 'Cierres de Caja', icon: Landmark },
          { id: 'ingresos', label: 'Flujo de Ingresos', icon: ArrowUpRight },
          { id: 'egresos', label: 'Flujo de Egresos', icon: ArrowDownLeft },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3.5 text-xs font-medium uppercase tracking-widest transition-all rounded-t-sm border-b-2 ${
                isActive 
                  ? 'border-purple-600 dark:border-purple-500 text-slate-900 dark:text-white bg-white dark:bg-[#121016]/80 dark:backdrop-blur-md font-semibold' 
                  : 'border-transparent opacity-50 hover:opacity-100 text-slate-600 dark:text-purple-300/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-purple-950/60'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* VISTA CONTENEDORA */}
      <div className="animate-fadeIn">
        {/* Renderizado condicional de las vistas financieras */}
        {activeTab === 'cierre' && (
          <CierreCaja />
        )}

        {activeTab === 'ingresos' && (
          <Ingresos 
            filtroMetodoPago={filtroMetodoPago} 
            setFiltroMetodoPago={setFiltroMetodoPago} 
          />
        )}

        {activeTab === 'egresos' && (
          <Egresos />
        )}
      </div>

    </div>
  );
}