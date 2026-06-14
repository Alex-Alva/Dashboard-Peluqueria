import React from 'react';
import { Type } from 'lucide-react';

export default function Tipografia({ tamanoTexto, setTamanoTexto, tipoFuente, setTipoFuente }) {
  return (
    <div className="bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/10">
          <Type className="text-indigo-600 dark:text-indigo-400" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Tipografía
        </h2>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Tamaño de Texto
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { valor: 'pequeno', nombre: 'Pequeño', ejemplo: 'text-xs' },
            { valor: 'mediano', nombre: 'Mediano', ejemplo: 'text-sm' },
            { valor: 'grande', nombre: 'Grande', ejemplo: 'text-base' },
          ].map((tamano) => (
            <button
              key={tamano.valor}
              onClick={() => setTamanoTexto(tamano.valor)}
              className={`p-4 rounded-xl border-2 transition-all ${
                tamanoTexto === tamano.valor
                  ? 'border-purple-600 bg-purple-500/10'
                  : 'border-slate-200 dark:border-purple-950/40 hover:border-purple-400'
              }`}
            >
              <span className={`block font-semibold text-slate-900 dark:text-white ${tamano.ejemplo}`}>
                {tamano.nombre}
              </span>
              <span className={`block text-slate-500 dark:text-purple-300/50 mt-1 ${tamano.ejemplo}`}>
                Aa
              </span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Tipo de Fuente
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { valor: 'sans', nombre: 'Sans Serif', clase: 'font-sans' },
            { valor: 'serif', nombre: 'Serif', clase: 'font-serif' },
            { valor: 'mono', nombre: 'Monospace', clase: 'font-mono' },
          ].map((fuente) => (
            <button
              key={fuente.valor}
              onClick={() => setTipoFuente(fuente.valor)}
              className={`p-4 rounded-xl border-2 transition-all ${
                tipoFuente === fuente.valor
                  ? 'border-indigo-600 bg-indigo-500/10'
                  : 'border-slate-200 dark:border-purple-950/40 hover:border-indigo-400'
              }`}
            >
              <span className={`block font-semibold text-slate-900 dark:text-white ${fuente.clase}`}>
                {fuente.nombre}
              </span>
              <span className={`block text-slate-500 dark:text-purple-300/50 mt-1 text-sm ${fuente.clase}`}>
                Ejemplo
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
