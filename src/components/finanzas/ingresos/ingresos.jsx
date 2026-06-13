import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  ShoppingBag, 
  Star,
  RotateCcw,
  X,
  Eye,
  Edit2,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { 
  formatFechaLocal, 
  formatMoneda,
  estaEnRangoFechas,
  toNumber,
  toLocalDateString
} from '../../../common/utils';

// Función auxiliar rápida para simular la fecha de hoy en formato local YYYY-MM-DD
const hoyLocal = new Date().toLocaleDateString('sv-SE'); // 'sv-SE' devuelve YYYY-MM-DD limpiamente

const MOCK_INGRESOS = [
  {
    id: 1,
    tipo: 'Efectivo',
    descripcion: 'Corte de cabello y barba premium',
    monto: 75.00,
    // Eliminamos el .toISOString() y la "Z" del final para que se mantenga en zona local
    fecha: `${hoyLocal}T10:30:00`,
    codigo_venta: 'V-001',
    ventas: {
      id: 101,
      fecha: `${hoyLocal}T10:30:00`,
      nombre_cliente: 'Carlos Mendoza',
      detalle_venta: [
        { tipo: 'servicio', subtotal: 75.00 }
      ]
    }
  },
  {
    id: 2,
    tipo: 'Yape',
    descripcion: 'mixto',
    monto: 120.00,
    fecha: `${hoyLocal}T12:15:00`,
    ventas: {
      id: 102,
      fecha: `${hoyLocal}T12:15:00`,
      nombre_cliente: 'Ana López',
      detalle_venta: [
        { tipo: 'servicio', subtotal: 80.00 },
        { tipo: 'producto', subtotal: 40.00 }
      ]
    }
  },
  {
    id: 3,
    tipo: 'Tarjeta',
    descripcion: 'Pomada Matte Elegance',
    monto: 45.00,
    fecha: `${hoyLocal}T15:40:00`,
    ventas: {
      id: 103,
      fecha: `${hoyLocal}T15:40:00`,
      nombre_cliente: 'Jorge Rivera',
      detalle_venta: [
        { tipo: 'producto', subtotal: 45.00 }
      ]
    }
  },
  {
    id: 4,
    tipo: 'Plin',
    descripcion: 'Propina especial de fin de semana',
    monto: 20.00,
    fecha: `${hoyLocal}T18:00:00`,
    codigo_venta: null,
    ventas: null
  }
];

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(
    toLocalDateString(new Date())
  );
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');

  // ESTADOS PARA EL MODAL DE INGRESO EXTRA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevoMetodo, setNuevoMetodo] = useState('Efectivo');

  // ESTADOS PARA EL MODAL DE VER DETALLE
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  // ESTADOS PARA EL MODAL DE EDICIÓN
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMonto, setEditMonto] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMetodo, setEditMetodo] = useState('Efectivo');
  const [esVenta, setEsVenta] = useState(false);

  const fetchIngresos = () => {
    setLoading(true);
    setTimeout(() => {
      let datosFiltrados = [...MOCK_INGRESOS];
      
      if (filtroFecha) {
        datosFiltrados = MOCK_INGRESOS.filter(item => {
          const fechaItem = toLocalDateString(item.ventas?.fecha || item.fecha);
          return fechaItem === filtroFecha;
        });
      }
      
      setIngresos(datosFiltrados);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchIngresos();
  }, [filtroFecha]);

const handleSaveIngresoExtra = (e) => {
  e.preventDefault();
  if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) return;

  const hoyLocal = new Date().toLocaleDateString('sv-SE');
  const horaLocal = new Date().toLocaleTimeString('es-PE', { hour12: false }); // "HH:MM:SS"

  const nuevoRegistro = {
    id: Date.now(),
    monto: parseFloat(nuevoMonto),
    tipo: nuevoMetodo,
    descripcion: nuevaDesc || 'Ingreso Extra',
    codigo_venta: null,
    fecha: `${hoyLocal}T${horaLocal}`,
    ventas: null
  };

  MOCK_INGRESOS.push(nuevoRegistro);

  setNuevoMonto('');
  setNuevaDesc('');
  setNuevoMetodo('Efectivo');
  setIsModalOpen(false);
  fetchIngresos();
};

  const handleAbirEdicion = (ingreso) => {
    setEditId(ingreso.id);
    setEditMonto(ingreso.monto);
    setEditDesc(ingreso.descripcion || `Venta registrada de ${ingreso.ventas?.nombre_cliente || 'Cliente'}`);
    setEditMetodo(ingreso.tipo || 'Efectivo');
    setEsVenta(!!ingreso.codigo_venta); 
    setIsEditModalOpen(true);
  };

  const handleUpdateIngreso = (e) => {
    e.preventDefault();
    if (!editMonto || parseFloat(editMonto) <= 0) return;

    const index = MOCK_INGRESOS.findIndex(item => item.id === editId);
    if (index !== -1) {
      MOCK_INGRESOS[index].descripcion = editDesc;
      MOCK_INGRESOS[index].tipo = editMetodo;

      if (!esVenta) {
        MOCK_INGRESOS[index].monto = parseFloat(editMonto);
      }
    }

    setIsEditModalOpen(false);
    fetchIngresos();
  };

  const limpiarFiltros = () => {
    setFiltroFecha(toLocalDateString(new Date())); 
    setFiltroTipo('Todos');
    setFiltroMetodo('Todos');
  };

  const obtenerTipoReal = (item) => {
    if (!item.codigo_venta) return 'Extra';
    if (item.ventas?.detalle_venta && item.ventas.detalle_venta.length > 0) {
      const tieneProducto = item.ventas.detalle_venta.some(d => d.tipo?.toLowerCase() === 'producto');
      const tieneServicio = item.ventas.detalle_venta.some(d => d.tipo?.toLowerCase() === 'servicio');
      
      if (tieneProducto && tieneServicio) return 'Mixto';
      if (tieneProducto) return 'Producto';
      if (tieneServicio) return 'Servicio';
    }
    return 'Servicio'; 
  };

  const ingresosFiltrados = ingresos.filter(item => {
    const tipoItem = obtenerTipoReal(item);
    const cumpleTipo = filtroTipo === 'Todos' ? true : tipoItem === filtroTipo;
    const cumpleMetodo = filtroMetodo === 'Todos' ? true : item.tipo?.toLowerCase() === filtroMetodo.toLowerCase();

    return cumpleTipo && cumpleMetodo;
  });

  const totales = ingresosFiltrados.reduce((acc, item) => {
    const montoNum = toNumber(item.monto, 0);
    acc.total += montoNum;

    const tipoReal = obtenerTipoReal(item);

    switch (tipoReal) {
      case 'Servicio':
        acc.servicios += montoNum;
        break;
      case 'Producto':
        acc.productos += montoNum;
        break;
      case 'Mixto':
        acc.servicios += montoNum / 2;
        acc.productos += montoNum / 2;
        break;
      case 'Extra':
        acc.extra += montoNum;
        break;
      default:
        break;
    }

    return acc;
  }, {
    total: 0,
    servicios: 0,
    productos: 0,
    extra: 0
  });

  const handleVerDetalle = (ingreso) => {
    let desgloseServicios = 0;
    let desgloseProductos = 0;

    if (ingreso.ventas?.detalle_venta) {
      ingreso.ventas.detalle_venta.forEach(d => {
        const sub = toNumber(d.subtotal, 0);
        if (d.tipo?.toLowerCase() === 'producto') desgloseProductos += sub;
        if (d.tipo?.toLowerCase() === 'servicio') desgloseServicios += sub;
      });
    }

    setSelectedIngreso({
      ...ingreso,
      tipoReal: obtenerTipoReal(ingreso),
      desgloseServicios,
      desgloseProductos
    });
    setIsDetailModalOpen(true);
  };

  return (
    <div className="animate-fadeIn text-slate-600 dark:text-purple-100/80">
      {/* Header interno */}
      <header className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-light tracking-widest uppercase text-slate-900 dark:text-white">
          Flujo de Ingresos <span className="text-purple-600 dark:text-purple-500">|</span>
        </h2>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white px-6 py-2.5 rounded-sm flex items-center gap-2 transition-all font-medium uppercase text-xs tracking-widest shadow-lg shadow-purple-950/20"
        >
          <Plus size={14} />
          Ingreso Extra
        </button>
      </header>

      {/* Cards Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Monto Total', value: totales.total, icon: Wallet },
          { label: 'Servicios', value: totales.servicios, icon: TrendingUp },
          { label: 'Productos', value: totales.productos, icon: ShoppingBag },
          { label: 'Ganancias Extra', value: totales.extra, icon: Star },
        ].map((card, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md p-6 border-b-2 border-purple-600 dark:border-purple-500 shadow-sm rounded-sm border-t border-x border-slate-100 dark:border-x-transparent dark:border-t-transparent transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">
                {card.label}
              </p>
              <card.icon className="text-purple-600 dark:text-purple-400" size={18} />
            </div>
            <h2 className="text-2xl font-light tracking-tight text-slate-900 dark:text-white">
              {formatMoneda(card.value)}
            </h2>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md p-6 mb-8 rounded-sm shadow-xs border border-slate-200 dark:border-purple-950/40 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium flex items-center gap-1.5">
              <Calendar size={12} className="text-purple-600 dark:text-purple-400" /> Día Específico
            </label>
            <input 
              type="date" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white font-light text-sm" 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Tipo de Ingreso</label>
            <select 
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white dark:bg-[#121016]"
            >
              <option value="Todos">Todos</option>
              <option value="Servicio">Servicio</option>
              <option value="Producto">Producto</option>
              <option value="Mixto">Mixto</option>
              <option value="Extra">Extra</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Método de Pago</label>
            <select 
              value={filtroMetodo}
              onChange={(e) => setFiltroMetodo(e.target.value)}
              className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white dark:bg-[#121016]"
            >
              <option value="Todos">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="yape">Yape</option>
              <option value="plin">Plin</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <button 
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 hover:text-slate-900 dark:hover:text-white transition-colors pb-2 font-medium"
          >
            <RotateCcw size={12} /> Reajustar Filtros
          </button>
        </div>
      </div>

      {/* Tabla Conectada */}
      <div className="bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md rounded-sm overflow-hidden shadow-xs border border-slate-200 dark:border-purple-950/40 transition-colors">
        {loading ? (
          <div className="p-10 text-center uppercase tracking-widest text-xs text-slate-400 dark:text-purple-400/40">Cargando base de datos simulada...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#121016]/80 border-b border-slate-200 dark:border-purple-950/40 text-slate-500 dark:text-purple-300/60 transition-colors">
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium">Fecha</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium">Tipo</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium">Descripción</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium">Monto</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium">Método</th>
                <th className="p-4 text-[10px] uppercase tracking-widest font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-slate-700 dark:text-purple-200/80">
              {ingresosFiltrados.map((row) => {
                const tipoReal = obtenerTipoReal(row);
                const fechaBase = row.ventas?.fecha || row.fecha;
                const fechaFormateada = formatFechaLocal(fechaBase, { includeTime: false, fallback: 'Sin fecha' });

                const badgeEstilos = {
                  'Servicio': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
                  'Producto': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
                  'Mixto': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
                  'Extra': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                };

                return (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors">
                    <td className="p-4 text-xs font-light">{fechaFormateada}</td>
                    <td className="p-4 text-xs">
                      <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-medium uppercase tracking-wider ${badgeEstilos[tipoReal] || 'bg-slate-500/10 text-slate-400'}`}>
                        {tipoReal}
                      </span>
                    </td>
                    <td className="p-4 text-xs opacity-90 font-light">
                      {row.descripcion && row.descripcion !== 'mixto'
                        ? row.descripcion 
                        : `Venta registrada de ${row.ventas?.nombre_cliente || 'Cliente'}`}
                    </td>
                    <td className="p-4 text-xs font-semibold text-purple-700 dark:text-purple-400">
                      {formatMoneda(row.monto)}
                    </td>
                    <td className="p-4 text-xs font-light italic opacity-60">
                      {row.tipo}
                    </td>

                    <td className="p-4 text-xs text-center flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleVerDetalle(row)}
                        className="text-slate-400 dark:text-purple-400/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
                        title="Ver Desglose Especifico"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        onClick={() => handleAbirEdicion(row)}
                        className="text-slate-400 dark:text-purple-400/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                        title="Corregir datos de venta"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {ingresosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest text-slate-400 dark:text-purple-400/30 opacity-60">
                    No hay registros para este día
                  </td>
                </tr>
              )}
            </tbody>
          </table> 
        )}
      </div>

      {/* MODAL INGRESO EXTRA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#121016]/60 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#121016]/80 dark:backdrop-blur-md w-full max-w-md p-6 border border-slate-200 dark:border-purple-950/40 shadow-2xl rounded-xs text-slate-800 dark:text-purple-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-light uppercase tracking-widest text-slate-900 dark:text-white">
                Registrar Ingreso Extra
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveIngresoExtra} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Monto (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-xl focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white font-light"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Descripción / Concepto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Propina, Alquiler de espacio, etc."
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white font-light"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Método de Recepción</label>
                <select 
                  value={nuevoMetodo}
                  onChange={(e) => setNuevoMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white dark:bg-[#121016]"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-slate-300 dark:border-purple-950/40 py-2.5 text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-purple-950/20 transition-colors text-slate-500 dark:text-purple-400/60"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white py-2.5 text-[10px] font-medium uppercase tracking-widest hover:brightness-110 transition-all shadow-md shadow-purple-950/20"
                >
                  Guardar Ingreso
                </button> 
              </div> 
            </form> 
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#121016]/60 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#121016]/80 dark:backdrop-blur-md w-full max-w-md p-6 border border-slate-200 dark:border-purple-950/40 shadow-2xl rounded-xs text-slate-800 dark:text-purple-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-light uppercase tracking-widest text-slate-900 dark:text-white">
                Corregir Datos del Ingreso
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {esVenta && (
              <div className="mb-5 bg-purple-500/5 border border-purple-500/20 text-purple-600 dark:text-purple-400 p-3 rounded-sm text-[11px] font-light flex gap-2.5 items-start leading-relaxed">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>
                  Este monto proviene de una venta enlazada. Para cambiar el valor económico, edítalo desde el módulo de <strong>Ventas</strong> para mantener el stock y desglose cuadrado.
                </span>
              </div>
            )}

            <form onSubmit={handleUpdateIngreso} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">
                  Monto (S/) {esVenta && <span className="text-purple-500 dark:text-purple-400/60 lowercase italic">(Bloqueado)</span>}
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  disabled={esVenta}
                  value={editMonto}
                  onChange={(e) => setEditMonto(e.target.value)}
                  className={`w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-xl focus:outline-none text-slate-900 dark:text-white ${
                    esVenta ? 'opacity-30 cursor-not-allowed border-dashed' : 'focus:border-purple-600 dark:focus:border-purple-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Descripción / Concepto</label>
                <input 
                  type="text" 
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white font-light"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-purple-400/50 font-medium">Método de Pago</label>
                <select 
                  value={editMetodo}
                  onChange={(e) => setEditMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 dark:border-purple-950/60 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-500 text-slate-900 dark:text-white dark:bg-[#121016]"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape">Yape</option>
                  <option value="Plin">Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 border border-slate-300 dark:border-purple-950/40 py-2.5 text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-purple-950/20 transition-colors text-slate-500 dark:text-purple-400/60"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white py-2.5 text-[10px] font-medium uppercase tracking-widest hover:brightness-110 transition-all shadow-md shadow-purple-950/20"
                >
                  Actualizar Datos
                </button>  
              </div> 
            </form> 
          </div>
        </div> 
      )}

      {/* MODAL DETALLE ESPECÍFICO DEL INGRESO */}
      {isDetailModalOpen && selectedIngreso && (
        <div className="fixed inset-0 bg-[#121016]/70 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#121016]/80 dark:backdrop-blur-md w-full max-w-md p-6 border border-slate-200 dark:border-purple-950/40 shadow-2xl rounded-sm text-slate-800 dark:text-purple-100">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-purple-950/20 pb-3">
              <h3 className="text-sm font-light uppercase tracking-widest text-slate-900 dark:text-white">
                Detalle del Ingreso
              </h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">Concepto / Descripción</span>
                <p className="text-sm font-light mt-1 text-slate-900 dark:text-white">
                  {selectedIngreso.descripcion && selectedIngreso.descripcion !== 'mixto'
                    ? selectedIngreso.descripcion 
                    : `Venta de productos/servicios`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">Origen / Cliente</span>
                  <p className="text-sm font-light mt-1 text-slate-900 dark:text-white">
                    {selectedIngreso.ventas?.nombre_cliente || 'Ingreso Extra Externo'}
                  </p>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">Código Venta</span>
                  <p className="text-sm font-normal font-mono mt-1 text-purple-600 dark:text-purple-400">
                    {selectedIngreso.codigo_venta || 'N/A'}
                  </p> 
                </div> 
              </div>

              <div className="border-t border-b border-slate-100 dark:border-purple-950/20 py-3.5 my-2 space-y-2.5">
                <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium mb-1">Desglose Específico</span>
                
                {selectedIngreso.tipoReal === 'Extra' ? (
                  <div className="flex justify-between text-xs py-1 font-light">
                    <span className="opacity-70">Monto Único (Extra):</span>
                    <span className="font-normal text-slate-900 dark:text-white">{formatMoneda(selectedIngreso.monto)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-xs font-light">
                      <span className="opacity-70 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Por Servicios:
                      </span>
                      <span className="font-normal text-slate-900 dark:text-white">{formatMoneda(selectedIngreso.desgloseServicios)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-light">
                      <span className="opacity-70 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Por Productos:
                      </span>
                      <span className="font-normal text-slate-900 dark:text-white">{formatMoneda(selectedIngreso.desgloseProductos)}</span>
                    </div>
                  </>  
                )}  
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">Método de Pago</span>
                  <p className="text-xs italic opacity-70 mt-0.5">{selectedIngreso.tipo}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-medium">Monto Total Cobrado</span>
                  <p className="text-xl font-medium mt-0.5 text-purple-600 dark:text-purple-400">{formatMoneda(selectedIngreso.monto)}</p>
                </div> 
              </div> 
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full border border-slate-300 dark:border-purple-950/40 py-2.5 text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-purple-950/20 text-slate-500 dark:text-purple-400/60 transition-colors"
              >
                Cerrar Detalle
              </button> 
            </div> 
          </div> 
        </div>
      )}
    </div>
  );
};

export default Ingresos;