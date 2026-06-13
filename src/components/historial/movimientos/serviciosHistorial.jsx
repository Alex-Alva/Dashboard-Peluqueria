import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, X, History, CheckCircle2, AlertCircle } from 'lucide-react';

const DATOS_MOCK_SERVICIOS = [
  {
    id: 1,
    servicio_id: "serv_01",
    nombre_servicio: "Corte de Cabello Premium + Lavado",
    accion: "Editado",
    fecha: "2026-06-01T15:30:00",
    valores_anteriores: { precio: 60.00, duracion: 45, descripcion: "Corte clásico" },
    valores_actuales: { precio: 75.00, duracion: 50, descripcion: "Corte premium con asesoría" }
  },
  {
    id: 2,
    servicio_id: "serv_02",
    nombre_servicio: "Balayage / Iluminación Global",
    accion: "Estado cambiado",
    fecha: "2026-06-01T11:00:00",
    valores_anteriores: { estado: true },
    valores_actuales: { estado: false }
  },
  {
    id: 3,
    servicio_id: "serv_03",
    nombre_servicio: "Tratamiento Hidratación de Argán",
    accion: "Creado",
    fecha: "2026-05-29T16:15:00",
    valores_anteriores: null,
    valores_actuales: { precio: 120.00, duracion: 60, descripcion: "Hidratación profunda" }
  },
  {
    id: 4,
    servicio_id: "serv_04",
    nombre_servicio: "Afeitado de Barba Ritual Toalla Caliente",
    accion: "Revertido",
    fecha: "2026-05-28T09:45:00",
    valores_anteriores: { precio: 45.00, duracion: 30 },
    valores_actuales: { precio: 40.00, duracion: 30 }
  },
  {
    id: 5,
    servicio_id: "serv_05",
    nombre_servicio: "Peinado de Fiesta / Trenzado",
    accion: "Eliminado",
    fecha: "2026-05-25T18:20:00",
    valores_anteriores: { precio: 90.00, duracion: 60 },
    valores_actuales: null
  }
];

export default function HistoryServicio() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo }); 
  };

  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  const fetchHistorial = () => {
    setLoading(true);
    setTimeout(() => {
      setLogs(DATOS_MOCK_SERVICIOS);
      setLoading(false);
    }, 550); 
  };

  useEffect(() => {
    fetchHistorial(); 
  }, []);

  const formatFechaLog = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }); 
  };

  const handleRevertir = (log) => {
    try {
      if (log.accion === 'Editado' && log.valores_anteriores) {
        const nuevoLogReversion = {
          id: Date.now(),
          servicio_id: log.servicio_id,
          nombre_servicio: log.nombre_servicio,
          accion: 'Revertido',
          fecha: new Date().toISOString(),
          valores_anteriores: log.valores_actuales,
          valores_actuales: log.valores_anteriores
        };
        setLogs(prevLogs => [nuevoLogReversion, ...prevLogs]);
        mostrarToast(`¡Cambios en el servicio "${log.nombre_servicio}" revertidos con éxito (Simulado)!`, "success");
      }
    } catch (error) {
      console.error("Error al revertir servicio:", error);
      mostrarToast(`No se pudo revertir el servicio de prueba`, "error");
    } 
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 text-slate-600 dark:bg-[#121016] dark:text-purple-200 transition-colors duration-300 relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) - GLASSMORPHISM */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' 
            ? 'bg-emerald-500/10 dark:bg-[#121016]/80 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-500/10 dark:bg-[#121016]/80 border-rose-500/30 text-rose-600 dark:text-rose-400'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs uppercase tracking-wider font-semibold">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button> 
        </div> 
      )}

      {/* ENCABEZADO */}
      <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-purple-600 dark:text-purple-400">
        <History size={16} />
        Log de Auditoría de Servicios
      </div>

      {/* CONTENEDOR DE LA TABLA */}
      <div className="bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/40 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-purple-950/40 text-[11px] uppercase tracking-widest bg-slate-100 dark:bg-[#121016] text-slate-900 dark:text-purple-300 opacity-90">
              <th className="p-4">Evento</th> 
              <th className="p-4">Servicio</th> 
              <th className="p-4">Cambios</th> 
              <th className="p-4">Fecha</th> 
              <th className="p-4 text-center">Detalles</th> 
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-purple-950/40 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-purple-400/50">
                  Cargando trazabilidad de servicios...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-purple-400/50">
                  No hay registros de modificaciones aún.
                </td> 
              </tr>
            ) : (
              logs.map((m) => (
                <tr key={m.id} className="bg-white dark:bg-[#121016] hover:bg-slate-50 dark:hover:bg-purple-950/20 transition-colors">
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                      m.accion === 'Creado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                      m.accion === 'Editado' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 
                      m.accion === 'Revertido' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 
                      m.accion === 'Estado cambiado' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      <span>
                        {m.accion === 'Creado' ? '🟢' : m.accion === 'Editado' ? '✏️' : m.accion === 'Revertido' ? '↩️' : m.accion === 'Estado cambiado' ? '🔄' : '🗑️'}
                      </span>
                      {m.accion} 
                    </div> 
                  </td>
                  
                  <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{m.nombre_servicio}</td>
                  
                  <td className="p-4 text-xs space-y-1">
                    {m.accion === 'Creado' ? (
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Valor Inicial: S/ {Number(m.valores_actuales?.precio || 0).toFixed(2)} ({m.valores_actuales?.duracion || 0} min)
                      </div>
                    ) : m.accion === 'Eliminado' ? (
                      <div className="text-rose-500 dark:text-rose-400 opacity-80 font-medium">
                        Servicio retirado del catálogo
                      </div>
                    ) : m.accion === 'Estado cambiado' ? (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-purple-300">
                        <span className="opacity-60 w-14">Estado:</span>
                        <span className={m.valores_anteriores?.estado ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}>
                          {m.valores_anteriores?.estado ? "Activo" : "Inactivo"}
                        </span>
                        <span className="opacity-40">→</span>
                        <span className={`font-bold ${m.valores_actuales?.estado ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
                          {m.valores_actuales?.estado ? "Activo" : "Inactivo"}
                        </span> 
                      </div>
                    ) : (
                      <>
                        {/* Render de Precios */}
                        {(m.valores_anteriores?.precio !== undefined || m.valores_actuales?.precio !== undefined) && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-purple-300">
                            <span className="opacity-60 w-14">Precio:</span>
                            <span className="text-rose-500 dark:text-rose-400 line-through">
                              S/ {Number(m.valores_anteriores?.precio || 0).toFixed(2)}
                            </span>
                            <span className="opacity-40">→</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              S/ {Number(m.valores_actuales?.precio || 0).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* Render de Duración */}
                        {(m.valores_anteriores?.duracion !== undefined || m.valores_actuales?.duracion !== undefined) && (
                          <div className="flex items-center gap-2 text-slate-600 dark:text-purple-300">
                            <span className="opacity-60 w-14">Duración:</span>
                            <span className="text-rose-500 dark:text-rose-400 line-through">
                              {m.valores_anteriores?.duracion} min
                            </span>
                            <span className="opacity-40">→</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              {m.valores_actuales?.duracion} min
                            </span>
                          </div> 
                        )} 
                      </> 
                    )} 
                  </td>
                  
                  <td className="p-4 text-xs text-slate-500 dark:text-purple-400/70 font-normal">{formatFechaLog(m.fecha)}</td>
                  
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(m)}
                      className="text-purple-600 dark:text-purple-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all duration-200"
                      title="Ver todos los campos modificados"
                    >
                      <Eye size={16} className="mx-auto" /> 
                    </button>  
                  </td>
                  
                  <td className="p-4 text-center">
                    {m.accion === 'Editado' && (
                      <button 
                        onClick={() => handleRevertir(m)}
                        className="text-xs text-purple-600 dark:text-purple-400 border border-purple-600/30 dark:border-purple-500/30 px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors tracking-wide inline-flex items-center gap-1 font-medium"
                      >
                        <RotateCcw size={11}/> Revertir
                      </button>
                    )} 
                  </td> 
                </tr> 
              )) 
            )} 
          </tbody> 
        </table> 
      </div>

      {/* MODAL DETALLES - GLASSMORPHISM EN FONDO */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/50 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-950/40 pb-3 mb-4">
              <h3 className="text-xs uppercase tracking-widest font-black text-purple-600 dark:text-purple-400">
                Auditoría de Cambios / Servicio
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 dark:text-purple-400 hover:text-slate-600 dark:hover:text-white transition-colors" 
              >
                <X size={16} /> 
              </button>  
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-purple-200">
              <p>
                <span className="opacity-60 uppercase tracking-wider block text-[9px] text-slate-500 dark:text-purple-400">Servicio:</span> 
                <strong className="text-slate-900 dark:text-white text-sm font-bold">{selectedLog.nombre_servicio}</strong>
              </p>
              
              <p>
                <span className="opacity-60 uppercase tracking-wider block text-[9px] text-slate-500 dark:text-purple-400">ID de Base de Datos:</span> 
                <span className="font-mono text-slate-700 dark:text-purple-300 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[11px] border border-slate-200 dark:border-white/10">
                  {selectedLog.servicio_id}
                </span>
              </p>
              
              <p>
                <span className="opacity-60 uppercase tracking-wider block text-[9px] text-slate-500 dark:text-purple-400">Operación Realizada:</span> 
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-[10px]">
                  {selectedLog.accion}
                </span>
              </p>
              
              <div className="mt-4 space-y-3">
                {selectedLog.accion === 'Creado' ? (
                  <div className="bg-slate-50 dark:bg-[#121016]/60 border border-slate-200 dark:border-purple-950/40 rounded-xl p-4 space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-1">Datos de Alta</div>
                    <p><span className="opacity-60">Precio:</span> S/ {Number(selectedLog.valores_actuales?.precio || 0).toFixed(2)}</p>
                    <p><span className="opacity-60">Duración:</span> {selectedLog.valores_actuales?.duracion || 0} minutos</p>
                    <p><span className="opacity-60">Descripción:</span> {selectedLog.valores_actuales?.descripcion || 'Sin descripción'}</p>
                  </div>
                ) : (
                  <>
                    {/* Bloque Precio Modificado */}
                    {(selectedLog.valores_anteriores?.precio !== undefined || selectedLog.valores_actuales?.precio !== undefined) && (
                      <div className="bg-slate-50 dark:bg-[#121016]/60 border border-slate-200 dark:border-purple-950/40 rounded-xl p-4">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-purple-400/60 mb-2">Cambio de Precio</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[9px] text-slate-400 dark:text-purple-500 uppercase tracking-wider">Antes</div>
                            <div className="text-rose-500 dark:text-rose-400 text-base font-bold line-through">
                              S/ {Number(selectedLog.valores_anteriores?.precio || 0).toFixed(2)}
                            </div>  
                          </div>
                          <div className="text-slate-300 dark:text-purple-950 text-lg font-bold">→</div>
                          <div className="text-right">
                            <div className="text-[9px] text-slate-400 dark:text-purple-500 uppercase tracking-wider">Ahora</div>
                            <div className="text-emerald-600 dark:text-emerald-400 text-base font-bold">
                              S/ {Number(selectedLog.valores_actuales?.precio || 0).toFixed(2)}
                            </div> 
                          </div>  
                        </div> 
                      </div> 
                    )}

                    {/* Bloque Duración Modificada */}
                    {(selectedLog.valores_anteriores?.duracion !== undefined || selectedLog.valores_actuales?.duracion !== undefined) && (
                      <div className="bg-slate-50 dark:bg-[#121016]/60 border border-slate-200 dark:border-purple-950/40 rounded-xl p-4">
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-purple-400/60 mb-2">Cambio de Duración</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[9px] text-slate-400 dark:text-purple-500 uppercase tracking-wider">Antes</div>
                            <div className="text-rose-500 dark:text-rose-400 text-base font-bold line-through">
                              {selectedLog.valores_anteriores?.duracion || 0} min
                            </div>  
                          </div>
                          <div className="text-slate-300 dark:text-purple-950 text-lg font-bold">→</div>
                          <div className="text-right">
                            <div className="text-[9px] text-slate-400 dark:text-purple-500 uppercase tracking-wider">Ahora</div>
                            <div className="text-emerald-600 dark:text-emerald-400 text-base font-bold">
                              {selectedLog.valores_actuales?.duracion || 0} min
                            </div> 
                          </div>  
                        </div> 
                      </div> 
                    )}  
                  </> 
                )} 
              </div>

              {/* Botón de acción principal con gradiente neón solicitado */}
              <div className="pt-2">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-full text-center py-2 px-4 rounded-xl text-xs uppercase font-bold tracking-widest text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 shadow-lg shadow-purple-700/20 active:scale-[0.98] transition-all"
                >
                  Entendido
                </button>
              </div>

            </div> 
          </div>  
        </div> 
      )} 
    </div> 
  );
}