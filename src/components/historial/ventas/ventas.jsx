import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Eye, Calendar, User, Search, X, ShoppingBag } from 'lucide-react';

import { 
  formatFechaLocal, 
  estaEnRangoFechas, 
  formatMoneda,
  toNumber,
  contieneTexto,
  sanitizeString 
} from '../../../common/utils';

const DATOS_MOCK_VENTAS = [
  {
    id: 1,
    codigo_venta: "VTA-2026-001",
    fecha: "2026-06-01T14:20:00",
    nombre_cliente: "Valeria Mendoza",
    monto_total: 105.00,
    metodo_pago: "Efectivo"
  },
  {
    id: 2,
    codigo_venta: "VTA-2026-002",
    fecha: "2026-06-01T11:05:00",
    nombre_cliente: "Carlos Benítez",
    monto_total: 45.00,
    metodo_pago: "Yape"
  },
  {
    id: 3,
    codigo_venta: "VTA-2026-003",
    fecha: "2026-05-31T18:40:00",
    nombre_cliente: "Lucía Fernandini",
    monto_total: 215.00,
    metodo_pago: "Tarjeta"
  },
  {
    id: 4,
    codigo_venta: "VTA-2026-004",
    fecha: "2026-05-30T10:15:00",
    nombre_cliente: null, 
    monto_total: 35.00,
    metodo_pago: "Yape"
  },
  {
    id: 5,
    codigo_venta: "VTA-2026-005",
    fecha: "2026-05-29T16:30:00",
    nombre_cliente: "Amara Quintana",
    monto_total: 160.00,
    metodo_pago: "Tarjeta"
  }
];

const DATOS_MOCK_DETALLES = {
  "VTA-2026-001": [
    { id: 101, tipo: "servicio", cantidad: 1, precio_unitario: 75.00, descuento: 0.00, subtotal: 75.00 },
    { id: 102, tipo: "producto", cantidad: 1, precio_unitario: 30.00, descuento: 0.00, subtotal: 30.00 }
  ],
  "VTA-2026-002": [
    { id: 103, tipo: "servicio", cantidad: 1, precio_unitario: 45.00, descuento: 0.00, subtotal: 45.00 }
  ],
  "VTA-2026-003": [
    { id: 104, tipo: "servicio", cantidad: 1, precio_unitario: 180.00, descuento: 15.00, subtotal: 165.00 },
    { id: 105, tipo: "producto", cantidad: 2, precio_unitario: 25.00, descuento: 0.00, subtotal: 50.00 }
  ],
  "VTA-2026-004": [
    { id: 106, tipo: "servicio", cantidad: 1, precio_unitario: 35.00, descuento: 0.00, subtotal: 35.00 }
  ],
  "VTA-2026-005": [
    { id: 107, tipo: "servicio", cantidad: 1, precio_unitario: 120.00, descuento: 0.00, subtotal: 120.00 },
    { id: 108, tipo: "producto", cantidad: 1, precio_unitario: 40.00, descuento: 0.00, subtotal: 40.00 }
  ]
};

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const fetchVentas = () => {
    setLoading(true);
    setTimeout(() => {
      setVentas(DATOS_MOCK_VENTAS);
      setLoading(false);
    }, 500);
  };

  const fetchDetalleVenta = (codigoVenta) => {
    setLoadingDetalle(true);
    setTimeout(() => {
      const data = DATOS_MOCK_DETALLES[codigoVenta] || [];
      setDetallesVenta(data);
      setLoadingDetalle(false);
    }, 400);
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleVerDetalles = (venta) => {
    setVentaSeleccionada(venta);
    fetchDetalleVenta(venta.codigo_venta);
  };

  const ventasFiltradas = ventas.filter(v => {
    if (filtroMetodo !== 'Todos' && v.metodo_pago !== filtroMetodo) return false;

    if (busquedaCliente) {
      const nombreCliente = sanitizeString(v.nombre_cliente, 'cliente general');
      if (!contieneTexto(nombreCliente, busquedaCliente)) return false;
    }

    if (!estaEnRangoFechas(v.fecha, fechaInicio, fechaFin)) return false;

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-transparent transition-colors text-slate-600 dark:text-purple-100/80 animate-fadeIn">
      <div className="mb-6 p-4 bg-slate-50 dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm flex flex-wrap gap-6 items-center">
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-slate-400 dark:text-purple-400/50">
          <Filter size={14} className="text-purple-600 dark:text-purple-400" />
          Filtros de Venta:
        </div>
        <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#121016]/60 border border-slate-200 dark:border-purple-950/60 px-3 py-1.5 rounded-sm w-full sm:w-64">
          <Search size={14} className="opacity-40 text-purple-600 dark:text-purple-400" />
          <input 
            type="text" 
            placeholder="Buscar por cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="bg-transparent outline-none w-full text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-purple-300/30"
          />
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-light">
          <span className="opacity-50">Método:</span>
          <select
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="bg-transparent border-b border-slate-300 dark:border-purple-950/60 pb-0.5 outline-none focus:text-purple-600 dark:focus:text-purple-400 font-medium cursor-pointer dark:bg-[#121016]"
          >
            <option value="Todos">Todos</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Yape">Yape</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
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

        {(busquedaCliente || fechaInicio || fechaFin || filtroMetodo !== 'Todos') && (
          <button 
            type="button"
            onClick={() => { setBusquedaCliente(''); setFechaInicio(''); setFechaFin(''); setFiltroMetodo('Todos'); }}
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
              <th className="p-4 font-medium">Código de Venta</th>
              <th className="p-4 font-medium">Fecha Emisión</th>
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Método</th>
              <th className="p-4 text-right font-medium">Total Facturado</th>
              <th className="p-4 text-center font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-slate-700 dark:text-purple-200/80">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  Cargando historial de ventas...
                </td>
              </tr>
            ) : ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  No se encontraron registros de ventas
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors">
                  <td className="p-4 font-mono text-xs tracking-wider text-slate-700 dark:text-purple-300">
                    {v.codigo_venta}
                  </td>
                  <td className="p-4 text-xs font-light">
                    {formatFechaLocal(v.fecha, { includeTime: true })}
                  </td>
                  <td className="p-4 font-medium flex items-center gap-2 text-xs">
                    <User size={13} className="text-slate-400 dark:text-purple-400/40" />
                    {sanitizeString(v.nombre_cliente, "Cliente General")}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] uppercase font-medium tracking-wider border border-slate-200 dark:border-purple-950/60 bg-slate-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-sm text-slate-500 dark:text-purple-300">
                      {v.metodo_pago}
                    </span>
                  </td>
                  <td className="p-4 text-right text-purple-600 dark:text-purple-400 font-semibold text-xs">
                    {formatMoneda(v.monto_total)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      type="button"
                      onClick={() => handleVerDetalles(v)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:scale-110 transition-all inline-block"
                      title="Ver desglose de artículos"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {ventaSeleccionada && createPortal(
        <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 duration-200 animate-in fade-in">
          <div className="bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/60 w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden duration-200 animate-in zoom-in-95">
            
            <div className="p-4 bg-slate-50 dark:bg-[#121016]/90 border-b border-slate-200 dark:border-purple-950/40 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-purple-700 dark:text-purple-400">
                <ShoppingBag size={14} /> Detalle de Artículos / Servicios
              </div>
              <button 
                type="button"
                onClick={() => { setVentaSeleccionada(null); setDetallesVenta([]); }}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-[#121016]/40 border-b border-slate-200/60 dark:border-purple-950/20 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block text-[9px] uppercase text-slate-400 dark:text-purple-400/40 tracking-widest mb-0.5">Código Comprobante</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-purple-200">{ventaSeleccionada.codigo_venta}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-400 dark:text-purple-400/40 tracking-widest mb-0.5">Cliente</span>
                <span className="font-medium text-slate-800 dark:text-purple-200">{sanitizeString(ventaSeleccionada.nombre_cliente, "Cliente General")}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase text-slate-400 dark:text-purple-400/40 tracking-widest mb-0.5">Fecha de Compra</span>
                <span className="font-light text-slate-800 dark:text-purple-200">{formatFechaLocal(ventaSeleccionada.fecha, { includeTime: true })}</span>
              </div>
            </div>

            <div className="p-4 max-h-[350px] overflow-y-auto">
              {loadingDetalle ? (
                <div className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  Consultando sub-artículos...
                </div>
              ) : detallesVenta.length === 0 ? (
                <div className="p-10 text-center text-xs uppercase tracking-widest font-medium text-rose-500/80">
                  No se encontraron artículos registrados para esta venta.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-purple-950/30 opacity-60 uppercase tracking-widest text-[9px] text-slate-500 dark:text-purple-400/60">
                      <th className="pb-2 font-medium">Tipo</th>
                      <th className="pb-2 pl-2 font-medium">Cant.</th>
                      <th className="pb-2 text-right font-medium">Precio Unit.</th>
                      <th className="pb-2 text-right font-medium">Descuento</th>
                      <th className="pb-2 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-purple-950/10 text-slate-700 dark:text-purple-200/80">
                    {detallesVenta.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-purple-950/5">
                        <td className="py-3 font-medium">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium rounded-sm border ${
                            item.tipo === 'servicio' 
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' 
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                          }`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 pl-2 opacity-70 font-light">{item.cantidad}</td>
                        <td className="py-3 text-right font-light">{formatMoneda(item.precio_unitario)}</td>
                        <td className="py-3 text-right text-rose-500 font-light">-{formatMoneda(item.descuento)}</td>
                        <td className="py-3 text-right font-semibold text-slate-800 dark:text-purple-100">
                          {formatMoneda(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#121016]/90 border-t border-slate-200 dark:border-purple-950/40 flex justify-between items-center">
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/40 font-medium mb-0.5">Total Liquidado</span>
                <span className="text-base font-bold text-purple-600 dark:text-purple-400">{formatMoneda(ventaSeleccionada.monto_total)}</span>
              </div>
              <button 
                type="button"
                onClick={() => { setVentaSeleccionada(null); setDetallesVenta([]); }}
                className="px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest border border-slate-300 dark:border-purple-950/60 hover:bg-slate-100 dark:hover:bg-purple-950/20 text-slate-600 dark:text-purple-300 transition-all rounded-sm"
              >
                Regresar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}