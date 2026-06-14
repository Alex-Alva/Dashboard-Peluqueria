import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Check, X, UserX } from 'lucide-react';

export default function ClientesPanel({ ventaActual, seleccionarCliente, mockClientes = [] }) {
  const [busqueda, setBusqueda] = useState('');
  const [esManual, setEsManual] = useState(false);
  const [nombreManual, setNombreManual] = useState('');

  const clientesExtendidos = [
    ...mockClientes,
    { id: 'c3', nombre: 'Camila Silva', telefono: '934 567 890', email: 'camila@mail.com' },
    { id: 'c4', nombre: 'Diego Granados', telefono: '956 789 012', email: 'diego@mail.com' }
  ];

  const clientesFiltrados = clientesExtendidos.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.telefono.includes(busqueda)
  );

  const handleAgregarManual = () => {
    if (nombreManual.trim() !== '') {
      seleccionarCliente({
        id: 'manual-' + Date.now(),
        nombre: nombreManual.trim(),
        telefono: 'Cliente Personalizado'
      });
      setNombreManual('');
      setEsManual(false);
    }
  };

  return (
    <motion.div 
      key="cliente" 
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -10 }} 
      transition={{ duration: 0.15 }}
      className="flex flex-col h-full"
    >
      <div className="p-4 border-b border-slate-200/60 dark:border-purple-950/40 flex items-center justify-between font-bold text-xs uppercase text-slate-400 dark:text-zinc-500 tracking-wider">
        <div className="flex items-center gap-2">
          <User size={14} className="text-purple-600 dark:text-purple-400" /> <span>Clientes</span>
        </div>
        {ventaActual.cliente && (
          <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Asignado</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
        
        <div className="flex items-center gap-2">
          {esManual ? (
            <div className="flex-1 flex gap-1.5">
              <input 
                type="text" 
                value={nombreManual}
                onChange={(e) => setNombreManual(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAgregarManual()}
                placeholder="Escribe nombre de cliente..." 
                className="flex-1 px-3 py-2 bg-purple-600/5 dark:bg-purple-400/5 border border-purple-600 dark:border-purple-400 text-xs rounded-lg outline-none transition-colors text-purple-700 dark:text-purple-400 font-medium placeholder-purple-600/40 dark:placeholder-purple-400/40"
                autoFocus
              />
              <button 
                onClick={handleAgregarManual}
                className="px-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-xs rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                Listo
              </button>
            </div>
          ) : (
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o celular..." 
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-950/40 rounded-lg text-xs outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-colors" 
            />
          )}

          <button 
            onClick={() => {
              setEsManual(!esManual);
              setNombreManual('');
            }}
            className={`p-2 rounded-lg border transition-all ${esManual ? 'bg-purple-600/10 text-purple-600 border-purple-600/30 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/30' : 'border-slate-200 dark:border-purple-950/40 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-purple-950/30'}`}
            title={esManual ? "Volver al buscador" : "Escribir cliente de forma manual"}
          >
            {esManual ? <X size={15} /> : <UserX size={15} />}
          </button>
        </div>
        
        {ventaActual.cliente ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 relative flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check size={14} /> {ventaActual.cliente.nombre}
              </h4>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1 pl-5">{ventaActual.cliente.telefono}</p>
            </div>
            <button onClick={() => seleccionarCliente(null)} className="text-slate-400 hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map(c => (
                <div 
                  key={c.id} 
                  onClick={() => seleccionarCliente(c)} 
                  className="p-3 bg-white dark:bg-[#121016]/40 border border-slate-100 dark:border-purple-950/40 rounded-xl hover:border-purple-600/40 dark:hover:border-purple-400/40 cursor-pointer transition-all"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{c.nombre}</p>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">{c.telefono}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-center text-slate-400 dark:text-zinc-500 font-medium py-4">
                No se encontraron clientes coincidentes.
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}