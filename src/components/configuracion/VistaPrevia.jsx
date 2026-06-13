import React from 'react';
import { Eye, Building2 } from 'lucide-react';

export default function VistaPrevia({ 
  colorFondo, 
  colorBoton, 
  colorAcento, 
  tamanoTexto, 
  tipoFuente, 
  nombreSistema, 
  logoUrl, 
  menuItems 
}) {
  // Funciones auxiliares
  const getBackgroundColor = () => {
    const colores = {
      '#121016': 'bg-[#121016]',
      '#000000': 'bg-black',
      '#FFFFFF': 'bg-white',
      '#1e1b4b': 'bg-indigo-950',
      '#1e293b': 'bg-slate-800',
    };
    return colores[colorFondo] || 'bg-[#121016]';
  };

  const getButtonGradient = () => {
    const gradientes = {
      'purple-indigo': 'bg-gradient-to-r from-purple-700 to-indigo-600',
      'blue': 'bg-gradient-to-r from-blue-700 to-blue-500',
      'emerald': 'bg-gradient-to-r from-emerald-700 to-emerald-500',
      'rose': 'bg-gradient-to-r from-rose-700 to-rose-500',
      'amber': 'bg-gradient-to-r from-amber-700 to-amber-500',
    };
    return gradientes[colorBoton] || gradientes['purple-indigo'];
  };

  const getAccentColor = () => {
    const acentos = {
      'purple': 'text-purple-600 dark:text-purple-400',
      'indigo': 'text-indigo-600 dark:text-indigo-400',
      'blue': 'text-blue-600 dark:text-blue-400',
      'emerald': 'text-emerald-600 dark:text-emerald-400',
      'rose': 'text-rose-600 dark:text-rose-400',
    };
    return acentos[colorAcento] || acentos['purple'];
  };

  const getFontSize = () => {
    const tamanos = {
      'pequeno': 'text-xs',
      'mediano': 'text-sm',
      'grande': 'text-base',
    };
    return tamanos[tamanoTexto] || tamanos['mediano'];
  };

  const getFontFamily = () => {
    const fuentes = {
      'sans': 'font-sans',
      'serif': 'font-serif',
      'mono': 'font-mono',
    };
    return fuentes[tipoFuente] || fuentes['sans'];
  };

  return (
    <div className="sticky top-6 bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-rose-500/10">
          <Eye className="text-rose-600 dark:text-rose-400" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Vista Previa
        </h2>
      </div>

      {/* Miniatura de Interfaz */}
      <div className={`${getBackgroundColor()} rounded-xl overflow-hidden border-4 border-slate-200 dark:border-purple-950/60 shadow-2xl`}>
        
        {/* Mini Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo Preview" className="w-8 h-8 object-contain rounded" />
            ) : (
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Building2 size={16} className="text-purple-400" />
              </div>
            )}
            <span className={`${getFontSize()} ${getFontFamily()} font-bold text-white truncate`}>
              {nombreSistema}
            </span>
          </div>
        </div>

        {/* Mini Sidebar y Contenido */}
        <div className="flex h-64">
          {/* Mini Sidebar */}
          <div className="w-16 bg-black/20 backdrop-blur-sm border-r border-white/5 p-2 space-y-2">
            {menuItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="w-full aspect-square bg-white/5 rounded-lg flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
              >
                {item.icono}
              </div>
            ))}
          </div>

          {/* Mini Contenido */}
          <div className="flex-1 p-4 space-y-3">
            <div className="h-3 bg-white/10 rounded w-3/4"></div>
            <div className="h-2 bg-white/5 rounded w-full"></div>
            <div className="h-2 bg-white/5 rounded w-5/6"></div>
            
            <div className="mt-4 space-y-2">
              <div className={`inline-block px-3 py-1 ${getButtonGradient()} rounded text-white text-[10px] font-bold ${getFontFamily()}`}>
                Botón de Acción
              </div>
            </div>

            <div className="mt-4">
              <div className={`${getFontSize()} ${getFontFamily()} ${getAccentColor()} font-bold`}>
                Texto con acento
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info de Configuración Actual */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-purple-950/20 rounded-lg space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-purple-400/70">Fondo:</span>
          <span className="font-mono text-slate-900 dark:text-white">{colorFondo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-purple-400/70">Botones:</span>
          <span className="font-mono text-slate-900 dark:text-white">{colorBoton}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-purple-400/70">Acento:</span>
          <span className="font-mono text-slate-900 dark:text-white">{colorAcento}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-purple-400/70">Tamaño:</span>
          <span className="font-mono text-slate-900 dark:text-white">{tamanoTexto}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600 dark:text-purple-400/70">Fuente:</span>
          <span className="font-mono text-slate-900 dark:text-white">{tipoFuente}</span>
        </div>
      </div>
    </div>
  );
}
