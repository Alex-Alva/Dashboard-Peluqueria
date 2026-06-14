import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Calendar, Filter, X, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  formatFechaLocal, 
  formatMoneda,
  estaEnRangoFechas,
  toNumber
} from '../../../common/utils';

const hoyLocal = new Date().toLocaleDateString('sv-SE');

const DATOS_MOCK_CIERRES = [
  {
    id: 101,
    fecha_apertura: `${hoyLocal}T08:00:00`,
    fecha_cierre: `${hoyLocal}T21:30:00`,
    base_inicial: 200.00,
    ingresos_sistema: 1450.00,
    egresos_sistema: 120.00,
    efectivo_contado: 830.00,
    yape_contado: 350.00,
    tarjeta_contado: 200.00,
    plin_contado: 150.00,
    diferencia: 0.00
  },
  {
    id: 102,
    fecha_apertura: '2026-05-29T08:00:00',
    fecha_cierre: '2026-05-29T21:00:00',
    base_inicial: 200.00,
    ingresos_sistema: 1820.00,
    egresos_sistema: 350.00,
    efectivo_contado: 900.00,
    yape_contado: 400.00,
    tarjeta_contado: 200.00,
    plin_contado: 140.00,
    diferencia: -30.00
  },
  {
    id: 103,
    fecha_apertura: '2026-05-28T08:00:00',
    fecha_cierre: '2026-05-28T22:00:00',
    base_inicial: 150.00,
    ingresos_sistema: 980.00,
    egresos_sistema: 50.00,
    efectivo_contado: 720.00,
    yape_contado: 210.00,
    tarjeta_contado: 100.00,
    plin_contado: 70.00,
    diferencia: 20.00
  }
];

export default function CierreCaja() {
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [fechaInicio, setFechaInicio] = useState('2026-05-01');
  const [fechaFin, setFechaFin] = useState(hoyLocal);    

  const [cierresCaja, setCierresCaja] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);
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

  const fetchCierresCaja = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        setCierresCaja(DATOS_MOCK_CIERRES);
        mostrarToast("Historial de auditoría sincronizado con éxito", "success");
      } catch (error) {
        console.error('Error cargando cierres:', error);
        mostrarToast("Error al procesar el historial de cierres", "error");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    fetchCierresCaja();
  }, []);

  const cierresFiltrados = cierresCaja.filter(c => {
    let estadoCalculado = 'Cuadrado';
    const diferencia = toNumber(c.diferencia, 0);
    if (diferencia < 0) estadoCalculado = 'Faltante';
    if (diferencia > 0) estadoCalculado = 'Sobrante';

    if (filtroEstado !== 'Todos' && estadoCalculado !== filtroEstado) return false;
    if (!estaEnRangoFechas(c.fecha_apertura, fechaInicio, fechaFin ? fechaFin + 'T23:59:59' : null)) return false;

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-transparent transition-colors text-slate-600 dark:text-purple-100/80 relative animate-fadeIn">
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-sm shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
          notificacion.tipo === 'warning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' :
          'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="text-[11px] uppercase tracking-widest font-medium">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-sm hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="mb-6 p-4 bg-slate-50 dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-slate-400 dark:text-purple-400/50">
          <Filter size={14} className="text-purple-600 dark:text-purple-400" />
          Filtros de Auditoría:
        </div>

        <div className="flex items-center gap-2 text-xs font-light">
          <Calendar size={14} className="opacity-50 text-purple-600 dark:text-purple-400" />
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-transparent border-b border-slate-300 dark:border-purple-950/60 pb-0.5 outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white"
          />
          <span className="opacity-40 lowercase italic text-[11px]">hasta</span>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-transparent border-b border-slate-300 dark:border-purple-950/60 pb-0.5 outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-light">
          <span className="opacity-50">Estado:</span>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-transparent border-b border-slate-300 dark:border-purple-950/60 pb-0.5 outline-none focus:text-purple-600 dark:focus:text-purple-400 font-medium cursor-pointer dark:bg-[#121016]"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Cuadrado">Cuadrado</option>
            <option value="Faltante">Faltante</option>
            <option value="Sobrante">Sobrante</option>
          </select>
        </div>
        {(fechaInicio !== '2026-05-01' || fechaFin !== hoyLocal || filtroEstado !== 'Todos') && (
          <button 
            onClick={() => { setFechaInicio('2026-05-01'); setFechaFin(hoyLocal); setFiltroEstado('Todos'); }}
            className="text-[10px] uppercase tracking-widest font-medium text-rose-500 hover:text-rose-400 transition-colors ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="border border-slate-200 dark:border-purple-950/40 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-purple-950/40 text-[10px] uppercase tracking-widest bg-slate-50 dark:bg-[#121016]/80 text-slate-500 dark:text-purple-300/60">
              <th className="p-4 font-medium">Fecha de Cierre</th>
              <th className="p-4 text-right font-medium">Ingresos Sistema</th>
              <th className="p-4 text-right font-medium">Egresos Sistema</th>
              <th className="p-4 text-right font-medium">Diferencia</th>
              <th className="p-4 text-center font-medium">Estado</th>
              <th className="p-4 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-slate-700 dark:text-purple-200/80">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  Cargando cierres de caja...
                </td>
              </tr>
            ) : cierresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  No se encontraron datos de cierres
                </td>
              </tr>
            ) : (
              cierresFiltrados.map((c) => {
                let badgeEstilo = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
                let textoEstado = "Cuadrado";

                const diferencia = toNumber(c.diferencia, 0);
                if (diferencia < 0) {
                  badgeEstilo = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
                  textoEstado = "Faltante";
                } else if (diferencia > 0) {
                  badgeEstilo = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
                  textoEstado = "Sobrante";
                }

                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors">
                    <td className="p-4 font-light text-xs">
                      {formatFechaLocal(c.fecha_cierre || c.fecha_apertura, { includeTime: true })}
                    </td>
                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                      {formatMoneda(c.ingresos_sistema)}
                    </td>
                    <td className="p-4 text-right text-rose-600 dark:text-rose-400 text-xs font-light">
                      {formatMoneda(c.egresos_sistema)}
                    </td>
                    <td className={`p-4 text-right font-semibold text-xs ${diferencia === 0 ? 'opacity-40 text-slate-400' : diferencia < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {formatMoneda(diferencia)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 text-[9px] uppercase font-medium rounded-sm tracking-wider ${badgeEstilo}`}>
                        {textoEstado}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setCierreSeleccionado(c)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:scale-110 transition-all inline-block"
                        title="Ver detalles de auditoría"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {cierreSeleccionado && createPortal(
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 duration-200 animate-in fade-in">
          <div className="bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/60 w-full max-w-md shadow-2xl rounded-sm overflow-hidden duration-200 animate-in zoom-in-95">
            
            <div className="p-4 bg-slate-50 dark:bg-[#121016]/90 border-b border-slate-200 dark:border-purple-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-purple-700 dark:text-purple-400">
                <DollarSign size={14} /> Desglose Físico Completo
              </div>
              <button 
                type="button"
                onClick={() => setCierreSeleccionado(null)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-purple-950/20 pb-4">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/40 font-medium mb-0.5">Fecha Apertura</span>
                  <span className="text-xs font-light text-slate-800 dark:text-purple-200">{formatFechaLocal(cierreSeleccionado.fecha_apertura, { includeTime: true })}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/40 font-medium mb-0.5">Fecha Cierre</span>
                  <span className="text-xs font-light text-slate-800 dark:text-purple-200">{formatFechaLocal(cierreSeleccionado.fecha_cierre, { includeTime: true })}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-purple-950/20 pb-2">
                  <span className="opacity-60 font-light uppercase tracking-wide">Base Inicial en Caja:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatMoneda(cierreSeleccionado.base_inicial)}</span>
                </div>

                <div className="bg-slate-50 dark:bg-[#121016]/60 p-3.5 space-y-2 rounded-sm border border-slate-200/60 dark:border-purple-950/30">
                  <span className="block text-[9px] uppercase tracking-widest font-semibold text-purple-600 dark:text-purple-400/60 mb-2">Conteo Físico Realizado</span>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70 font-light">Efectivo Contado:</span>
                    <span className="font-medium text-slate-900 dark:text-purple-100">{formatMoneda(cierreSeleccionado.efectivo_contado)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70 font-light">Yape Contado:</span>
                    <span className="font-medium text-slate-900 dark:text-purple-100">{formatMoneda(cierreSeleccionado.yape_contado)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70 font-light">Tarjeta Contada:</span>
                    <span className="font-medium text-slate-900 dark:text-purple-100">{formatMoneda(cierreSeleccionado.tarjeta_contado)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70 font-light">Plin Contado:</span>
                    <span className="font-medium text-slate-900 dark:text-purple-100">{formatMoneda(cierreSeleccionado.plin_contado)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-4 text-center">
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                  <span className="block text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400/60 font-medium mb-0.5">Total Sistema</span>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatMoneda(cierreSeleccionado.ingresos_sistema)}</span>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-950/30 rounded-sm">
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/40 font-medium mb-0.5">Diferencia Final</span>
                  <span className={`text-sm font-bold ${toNumber(cierreSeleccionado.diferencia, 0) === 0 ? 'text-slate-400' : toNumber(cierreSeleccionado.diferencia, 0) < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {formatMoneda(cierreSeleccionado.diferencia)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#121016]/90 border-t border-slate-200 dark:border-purple-950/40 text-right">
              <button 
                type="button"
                onClick={() => setCierreSeleccionado(null)}
                className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-300 dark:border-purple-950/60 hover:bg-slate-100 dark:hover:bg-purple-950/20 text-slate-600 dark:text-purple-300 transition-all rounded-sm"
              >
                Cerrar Auditoría
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}