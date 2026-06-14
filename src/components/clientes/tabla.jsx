import React, { useMemo } from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import ClientesData from './datos/DatosClientes';

const getFrecuenciaColor = (frecuencia) => {
  switch (frecuencia) {
    case 'Frecuente': 
      return 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
    case 'Regular': 
      return 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    case 'Nuevo': 
      return 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-purple-300 border border-slate-200 dark:border-white/10';
    default: 
      return 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300';
  }
};

const calcularFrecuencia = (visitas) => {
  if (visitas === 0) return 'Nuevo';
  if (visitas >= 1 && visitas <= 6) return 'Regular';
  if (visitas >= 7) return 'Frecuente';
  return 'Nuevo'; 
};

const ClienteTable = ({ filters, listaClientes, abrirModal }) => {

  const clientesFiltrados = useMemo(() => {
    const datosOrigen = listaClientes || ClientesData;

    return datosOrigen
      .map(cliente => {
        const frecuenciaCalculada = calcularFrecuencia(cliente.visitas || 0);
        return {
          ...cliente,
          frecuencia: frecuenciaCalculada
        };
      })
      .filter(cliente => {
        const telefonoCliente = cliente.telefono || cliente.numero || '';
        
        const matchesSearch = 
          cliente.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
          String(telefonoCliente).includes(filters.search);

        const matchesFrecuencia = filters.frecuencia === '' || cliente.frecuencia === filters.frecuencia;

        let matchesVisitas = true;
        if (filters.visitas === '0-5') matchesVisitas = cliente.visitas <= 5;
        else if (filters.visitas === '5-15') matchesVisitas = cliente.visitas > 5 && cliente.visitas <= 15;
        else if (filters.visitas === '15-25') matchesVisitas = cliente.visitas > 15 && cliente.visitas <= 25;
        else if (filters.visitas === '25+') matchesVisitas = cliente.visitas > 25;

        return matchesSearch && matchesFrecuencia && matchesVisitas;
      });
  }, [filters, listaClientes]);

  return (
    <div className="w-full text-slate-600 dark:text-purple-200 font-sans relative">
      <div className="w-full overflow-hidden bg-white dark:bg-[#121016]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-purple-950/40 text-[11px] uppercase tracking-widest bg-slate-100 dark:bg-[#121016] text-slate-900 dark:text-purple-300 opacity-90">
                <th className="px-6 py-4 font-bold">Nombre</th>
                <th className="px-6 py-4 text-center font-bold">Teléfono</th>
                <th className="px-6 py-4 text-center font-bold">Frecuencia</th>
                <th className="px-6 py-4 text-center font-bold">Visitas</th>
                <th className="px-6 py-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-purple-950/40 text-sm">
              {clientesFiltrados.map((cliente) => (
                <tr 
                  key={cliente.id} 
                  className="bg-white dark:bg-[#121016] hover:bg-slate-50 dark:hover:bg-purple-600/5 transition-colors duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    {cliente.nombre}
                  </td>
                  <td className="px-6 py-4 text-center font-medium font-mono text-slate-500 dark:text-indigo-400">
                    {cliente.telefono || cliente.numero || '—'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getFrecuenciaColor(cliente.frecuencia)}`}>
                      {cliente.frecuencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-purple-600 dark:text-purple-400">
                    {cliente.visitas} un.
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => abrirModal('ver', cliente)}
                        className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 hover:scale-110 transition-all"
                        title="Ver Ficha"
                      >
                        <Eye size={15} />
                      </button>

                      <button 
                        onClick={() => abrirModal('editar', cliente)}
                        className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 hover:scale-110 transition-all"
                        title="Editar Perfil"
                      >
                        <Pencil size={15} />
                      </button>

                      <button 
                        onClick={() => {
                          console.log('Botón de eliminar clickeado para cliente:', cliente.id);
                        }}
                        className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:scale-110 transition-all"
                        title="Eliminar Cliente"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-purple-400/50 italic">
                    No se encontraron registros de clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClienteTable;