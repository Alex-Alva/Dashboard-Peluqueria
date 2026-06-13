import React, { useState } from 'react';
import { History, FileText, Scissors, Package } from 'lucide-react';

// Importación de los componentes hijos
import CierreCaja from '../components/historial/finanzas/cierreDeCaja';
import Ventas from '../components/historial/ventas/ventas';
import Citas from '../components/historial/citas/citas';
import HistoryProductos from '../components/historial/movimientos/productosHistorial';
import HistoryServicio from '../components/historial/movimientos/serviciosHistorial';

export default function HistoryGeneral() {
  const [activeTab, setActiveTab] = useState('financiero');
  
  // Filtros locales para pestañas específicas
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [tipoVistaMov, setTipoVistaMov] = useState('Productos');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121016] p-8 text-slate-800 dark:text-purple-100/90 transition-colors duration-300">
      
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-light tracking-widest uppercase text-slate-900 dark:text-white">
          Módulo de Historiales <span className="text-purple-600 dark:text-purple-500">|</span>
        </h1>
        <p className="text-[10px] text-slate-500 dark:text-purple-400/60 mt-2 tracking-widest uppercase opacity-80">
          Auditoría general del sistema de peluquería
        </p>
      </header>

      {/* PESTAÑAS (TABS) */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-purple-950/40 mb-8 gap-1">
        {[
          { id: 'financiero', label: 'Cierres de Caja', icon: History },
          { id: 'ventas', label: 'Historial de Ventas', icon: FileText },
          { id: 'citas', label: 'Control de Citas', icon: Scissors },
          { id: 'movimientos', label: 'Movimientos catálogo', icon: Package },
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

      {/* CONTENEDOR GLOBAL */}
      <div className="bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-sm shadow-xl overflow-hidden transition-colors">
        
        {/* Renderizado condicional de componentes hijos */}
        {activeTab === 'financiero' && (
          <CierreCaja />
        )}

        {activeTab === 'ventas' && (
          <Ventas 
            filtroMetodo={filtroMetodo} 
            setFiltroMetodo={setFiltroMetodo} 
          />
        )}

        {activeTab === 'citas' && (
          <Citas 
            filtroEstado={filtroEstado} 
            setFiltroEstado={setFiltroEstado} 
          />
        )}

        {activeTab === 'movimientos' && (
          <div className="animate-fadeIn">
            {/* Sub-selector estilizado con efecto Glassmorphism */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-[#121016]/80 border-b border-slate-200 dark:border-purple-950/40 flex gap-2">
              {['Productos', 'Servicios'].map(v => (
                <button
                  key={v}
                  onClick={() => setTipoVistaMov(v)}
                  className={`px-5 py-2 text-[10px] uppercase tracking-widest font-medium border transition-all rounded-sm ${
                    tipoVistaMov === v 
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white border-transparent shadow-lg shadow-purple-950/20' 
                      : 'border-slate-200 dark:border-purple-950/40 text-slate-600 dark:text-purple-300/60 opacity-70 hover:opacity-100 bg-white dark:bg-transparent'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Componentes independientes conectados */}
            {tipoVistaMov === 'Productos' ? (
              <HistoryProductos />
            ) : (
              <HistoryServicio />
            )}
          </div>
        )}

      </div>
    </div>
  );
}