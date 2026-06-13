import React from 'react';
import { Palette } from 'lucide-react';

export default function PaletaColores({ colorFondo, setColorFondo, colorBoton, setColorBoton, colorAcento, setColorAcento }) {
  return (
    <div className="bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Palette className="text-purple-600 dark:text-purple-400" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Paleta de Colores
        </h2>
      </div>

      {/* Color de Fondo */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Color de Fondo Principal
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { valor: '#121016', nombre: 'Púrpura Oscuro', clase: 'bg-[#121016]' },
            { valor: '#000000', nombre: 'Negro', clase: 'bg-black' },
            { valor: '#FFFFFF', nombre: 'Blanco', clase: 'bg-white border-2 border-slate-300' },
            { valor: '#1e1b4b', nombre: 'Índigo', clase: 'bg-indigo-950' },
            { valor: '#1e293b', nombre: 'Slate', clase: 'bg-slate-800' },
          ].map((color) => (
            <button
              key={color.valor}
              onClick={() => setColorFondo(color.valor)}
              className={`h-16 rounded-xl ${color.clase} transition-all hover:scale-105 ${
                colorFondo === color.valor 
                  ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-[#121016]' 
                  : ''
              }`}
              title={color.nombre}
            />
          ))}
        </div>
      </div>

      {/* Color de Botones */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Estilo de Botones
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { valor: 'purple-indigo', nombre: 'Púrpura-Índigo', clase: 'bg-gradient-to-r from-purple-700 to-indigo-600' },
            { valor: 'blue', nombre: 'Azul', clase: 'bg-gradient-to-r from-blue-700 to-blue-500' },
            { valor: 'emerald', nombre: 'Esmeralda', clase: 'bg-gradient-to-r from-emerald-700 to-emerald-500' },
            { valor: 'rose', nombre: 'Rosa', clase: 'bg-gradient-to-r from-rose-700 to-rose-500' },
            { valor: 'amber', nombre: 'Ámbar', clase: 'bg-gradient-to-r from-amber-700 to-amber-500' },
          ].map((estilo) => (
            <button
              key={estilo.valor}
              onClick={() => setColorBoton(estilo.valor)}
              className={`h-12 rounded-xl ${estilo.clase} transition-all hover:scale-105 ${
                colorBoton === estilo.valor 
                  ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-[#121016]' 
                  : '' }`}
              title={estilo.nombre}
            />
          ))}
        </div>
      </div>

      {/* Color de Acentos */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Color de Acentos
        </label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { valor: 'purple', nombre: 'Púrpura', clase: 'bg-purple-600' },
            { valor: 'indigo', nombre: 'Índigo', clase: 'bg-indigo-600' },
            { valor: 'blue', nombre: 'Azul', clase: 'bg-blue-600' },
            { valor: 'emerald', nombre: 'Esmeralda', clase: 'bg-emerald-600' },
            { valor: 'rose', nombre: 'Rosa', clase: 'bg-rose-600' },
          ].map((acento) => (
            <button
              key={acento.valor}
              onClick={() => setColorAcento(acento.valor)}
              className={`h-12 rounded-xl ${acento.clase} transition-all hover:scale-105 ${
                colorAcento === acento.valor 
                  ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-[#121016]' 
                  : ''
              }`}
              title={acento.nombre}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
