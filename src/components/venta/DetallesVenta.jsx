import React from 'react';
import { Sparkles, Trash2, Plus, Minus } from 'lucide-react';

export default function DetalleVenta({ ventaActual, eliminarDelCarrito, actualizarCantidad, setShowPago }) {
  return (
    <div className="flex-1 flex flex-col p-6 h-full overflow-hidden">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-purple-950/40 mb-4 gap-4">
        <span className="font-bold text-sm tracking-wider uppercase text-slate-400 dark:text-zinc-500 whitespace-nowrap">Detalle de Venta Actual</span>
        {ventaActual.cliente && (
          <span className="text-xs bg-purple-600/10 text-purple-700 dark:bg-purple-400/10 dark:text-purple-400 px-3 py-1 rounded-full font-medium truncate max-w-[200px]" title={ventaActual.cliente.nombre}>
            Para: {ventaActual.cliente.nombre}
          </span>
        )}
      </div>

      {/* LISTA DE ITEMS DEL CARRITO */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5">
        {ventaActual.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-zinc-500 gap-2 bg-white/40 dark:bg-[#121016]/40 rounded-2xl border border-slate-200 dark:border-purple-950/40 backdrop-blur-md">
            <Sparkles size={32} className="text-purple-300 dark:text-purple-900/60" />
            <p className="text-sm text-center leading-relaxed font-medium">
              No hay ítems seleccionados.<br/>Agrega clientes, servicios o productos desde la izquierda.
            </p>
          </div>
        ) : (
          ventaActual.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center bg-white dark:bg-[#121016]/40 p-4 rounded-xl border border-slate-200 dark:border-purple-950/30 shadow-sm group backdrop-blur-md">
              <div className="max-w-[65%]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${item.tipo === 'Servicio' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'}`}>
                    {item.tipo}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200 truncate">{item.nombre}</p>
                </div>
                
                {/* Control de cantidad */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-50 dark:bg-purple-950/30 border border-slate-200 dark:border-purple-950/50 rounded-md p-0.5">
                    <button 
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-purple-950/50 transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="text-xs font-bold px-2 min-w-[20px] text-center text-slate-700 dark:text-zinc-300">
                      {item.cantidad}
                    </span>
                    <button 
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="p-1 rounded text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-purple-950/50 transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">× S/ {item.precio.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-purple-950/50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SECCIÓN INFERIOR DE TOTALES */}
      <div className="mt-4 bg-white/60 dark:bg-[#121016]/50 border border-slate-200 dark:border-purple-950/40 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 dark:border-purple-950/30 pb-3">
          <div className="flex justify-between text-slate-400 dark:text-zinc-500">
            <span>Subtotal:</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">S/ {(ventaActual.total * 0.82).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400 dark:text-zinc-500">
            <span>IGV (18%):</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">S/ {(ventaActual.total * 0.18).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Total a Pagar</span>
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">S/ {ventaActual.total.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={ventaActual.items.length === 0}
            onClick={() => setShowPago(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:opacity-95 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-purple-950/40 dark:disabled:to-purple-950/40 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span>Confirmar Detalles</span>
          </button>
        </div>
      </div>
    </div>
  );
}