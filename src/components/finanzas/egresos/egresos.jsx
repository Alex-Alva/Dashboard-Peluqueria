import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wallet, 
  Package, 
  Droplets, 
  AlertTriangle, 
  RotateCcw,
  X,
  Edit2
} from 'lucide-react';
import { 
  formatFechaLocal, 
  formatMoneda,
  toNumber,
  toLocalDateString
} from '../../../common/utils';

const Egresos = () => {
  // Función auxiliar para obtener la fecha actual en formato YYYY-MM-DD (Local)
  const getFechaActualLocal = () => {
    return toLocalDateString(new Date());
  };

  // ==========================================
  // DATOS SIMULADOS INICIALES PARA PRUEBAS
  // ==========================================
  const datosSimuladosIniciales = [
    { id: 1, fecha: getFechaActualLocal(), categoria: 'Compra de Productos', descripcion: 'Lote de tintes y champú premium', monto: 350.00, metodo_pago: 'Tarjeta' },
    { id: 2, fecha: getFechaActualLocal(), categoria: 'Pagos de Servicios', descripcion: 'Recibo de luz local comercial', monto: 120.50, metodo_pago: 'Efectivo' },
    { id: 3, fecha: getFechaActualLocal(), categoria: 'Imprevistos', descripcion: 'Reparación de cañería baño', monto: 80.00, metodo_pago: 'Yape / Plin' },
    { id: 4, fecha: '2026-05-15', categoria: 'Devoluciones', descripcion: 'Devolución cliente por producto dañado', monto: 45.00, metodo_pago: 'Efectivo' }
  ];

  // ESTADOS PARA DATOS Y FILTROS
  const [egresos, setEgresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState(getFechaActualLocal());
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  // ESTADOS PARA EL MODAL DE NUEVO EGRESO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevaCat, setNuevaCat] = useState('Compra de Productos');
  const [nuevoMetodo, setNuevoMetodo] = useState('Efectivo');

  // ESTADOS PARA EL MODAL DE EDICIÓN / CORRECCIÓN
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMonto, setEditMonto] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState('Compra de Productos');
  const [editMetodo, setEditMetodo] = useState('Efectivo');

  // ==========================================
  // 1. CARGA DE DATOS SIMULADOS
  // ==========================================
  const fetchEgresos = async () => {
    setLoading(true);
    // Simulamos latencia de red de 400ms
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Si no hay datos previos guardados en el estado, cargamos los iniciales
    if (egresos.length === 0) {
      setEgresos(datosSimuladosIniciales);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEgresos();
  }, []);

  // ==========================================
  // 2. LÓGICA: REGISTRAR NUEVO EGRESO
  // ==========================================
  const handleSaveEgreso = (e) => {
    e.preventDefault();
    if (!nuevoMonto || parseFloat(nuevoMonto) <= 0) return;

    const nuevoRegistro = {
      id: Date.now(), // ID único temporal
      fecha: getFechaActualLocal(),
      monto: parseFloat(nuevoMonto),
      categoria: nuevaCat,
      descripcion: nuevaDesc,
      metodo_pago: nuevoMetodo
    };

    setEgresos(prev => [nuevoRegistro, ...prev]);

    // Limpieza de campos
    setNuevoMonto('');
    setNuevaDesc('');
    setNuevaCat('Compra de Productos');
    setNuevoMetodo('Efectivo');
    setIsModalOpen(false);
  };

  // ==========================================
  // 3. LÓGICA: EDICIÓN / CORRECCIÓN DE EGRESOS
  // ==========================================
  const handleAbrirEdicion = (egreso) => {
    setEditId(egreso.id);
    setEditMonto(egreso.monto);
    setEditDesc(egreso.descripcion);
    setEditCat(egreso.categoria);
    setEditMetodo(egreso.metodo_pago || 'Efectivo');
    setIsEditModalOpen(true);
  };

  const handleUpdateEgreso = (e) => {
    e.preventDefault();
    if (!editMonto || parseFloat(editMonto) <= 0) return;

    setEgresos(prev => prev.map(item => {
      if (item.id === editId) {
        return {
          ...item,
          monto: parseFloat(editMonto),
          categoria: editCat,
          descripcion: editDesc,
          metodo_pago: editMetodo
        };
      }
      return item;
    }));

    setIsEditModalOpen(false);
  };

  // ==========================================
  // 4. FILTROS EN CLIENTE
  // ==========================================
  const limpiarFiltros = () => {
    setFiltroFecha(getFechaActualLocal());
    setFiltroCategoria('Todos');
  };

  const egresosFiltrados = egresos.filter(item => {
    const cumpleFecha = filtroFecha ? item.fecha?.startsWith(filtroFecha) : true;
    const cumpleCat = filtroCategoria === 'Todos' ? true : item.categoria === filtroCategoria;
    return cumpleFecha && cumpleCat;
  });

  // ==========================================
  // 5. CÁLCULO DE RESUMEN ACUMULADO
  // ==========================================
  const totales = egresosFiltrados.reduce((acc, item) => {
    const montoNum = toNumber(item.monto, 0);
    acc.total += montoNum;

    if (item.categoria === 'Compra de Productos') {
      acc.productos += montoNum;
    } else if (item.categoria === 'Pagos de Servicios' || item.categoria === 'Materiales') {
      acc.servicios += montoNum;
    } else {
      acc.otros += montoNum; 
    }
    return acc;
  }, { total: 0, productos: 0, servicios: 0, otros: 0 });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121016] p-8 text-slate-800 dark:text-zinc-100 transition-colors duration-300">

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-slate-900 dark:text-white">
          Egresos <span className="text-purple-600 dark:text-purple-400">.</span>
        </h1>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white dark:text-[#121016] px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-purple-600/10 dark:shadow-purple-500/5"
        >
          <Plus size={16} />
          Nuevo Egreso
        </button>
      </header>

      {/* Cards de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Egresos', value: totales.total, icon: Wallet, border: 'border-purple-600 dark:border-purple-400' },
          { label: 'Productos', value: totales.productos, icon: Package, border: 'border-slate-200 dark:border-purple-950/20' },
          { label: 'Servicios e Insumos', value: totales.servicios, icon: Droplets, border: 'border-slate-200 dark:border-purple-950/20' },
          { label: 'Otros / Imprevistos', value: totales.otros, icon: AlertTriangle, border: 'border-rose-500/50' },
        ].map((card, index) => (
          <div 
            key={index} 
            className={`bg-white dark:bg-[#121016]/40 p-6 border-b-2 ${card.border} shadow-sm rounded-xl`}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-medium">
                {card.label}
              </p>
              <card.icon className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              - {formatMoneda(card.value)}
            </h2>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-[#121016]/20 p-6 mb-8 rounded-xl shadow-sm border border-slate-100 dark:border-purple-950/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Rango de Fechas</label>
            <input 
              type="date" 
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:text-white text-slate-900 font-medium text-sm" 
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Categoría</label>
            <select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:bg-[#121016] text-slate-700 dark:text-zinc-300 text-sm font-medium"
            >
              <option value="Todos">Todas</option>
              <option value="Compra de Productos">Compra de Productos</option>
              <option value="Pagos de Servicios">Pagos de Servicios</option>
              <option value="Imprevistos">Imprevistos</option>
              <option value="Devoluciones">Devoluciones</option>
            </select>
          </div>

          <button 
            onClick={limpiarFiltros}
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:opacity-80 transition-opacity pb-2 font-bold"
          >
            <RotateCcw size={14} /> Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white dark:bg-[#121016]/20 border border-slate-100 dark:border-purple-950/30 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center uppercase tracking-widest text-xs font-semibold text-slate-400 dark:text-zinc-500">Cargando transacciones...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-purple-950/20 text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Descripción</th>
                  <th className="p-4 text-right">Monto</th>
                  <th className="p-4">Método</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-sm">
                {egresosFiltrados.map((row) => {
                  const esImprevisto = row.categoria === 'Imprevistos';
                  const esDevolucion = row.categoria === 'Devoluciones';
                  
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors group">
                      <td className="p-4 text-slate-500 dark:text-zinc-400 font-medium">
                        {formatFechaLocal(row.fecha, { includeTime: false, fallback: '---' })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          esImprevisto ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' : 
                          esDevolucion ? 'bg-slate-500/10 text-slate-500 dark:text-zinc-400' :
                          'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        }`}>
                          {row.categoria}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-zinc-300 font-light italic">
                        {esImprevisto && <AlertTriangle size={12} className="inline mr-1 text-rose-500" />}
                        {row.descripcion}
                      </td>
                      <td className="p-4 text-right font-bold text-rose-500 dark:text-rose-400">
                        - {formatMoneda(row.monto)}
                      </td>
                      <td className="p-4 text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold">{row.metodo_pago}</td>
                      
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleAbrirEdicion(row)}
                          className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
                          title="Corregir datos de egreso"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {egresosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-10 text-center uppercase tracking-widest text-xs font-semibold text-slate-400 dark:text-zinc-500">No hay egresos registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORMULARIO NUEVO EGRESO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#121016]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-[#121016] w-full max-w-md p-6 border border-slate-200 dark:border-purple-950/60 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-light uppercase tracking-widest text-slate-900 dark:text-white">
                Registrar Nuevo Egreso
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEgreso} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Monto (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-xl font-bold focus:outline-none focus:border-purple-600 dark:focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Categoría</label>
                <select 
                  value={nuevaCat}
                  onChange={(e) => setNuevaCat(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:bg-[#121016] text-slate-700 dark:text-zinc-300 font-medium"
                >
                  <option value="Compra de Productos">Compra de Productos</option>
                  <option value="Pagos de Servicios">Pagos de Servicios</option>
                  <option value="Imprevistos">Imprevistos</option>
                  <option value="Devoluciones">Devoluciones</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Descripción / Motivo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Recibo LuzSur, Lote de tintes, etc."
                  value={nuevaDesc}
                  onChange={(e) => setNuevaDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Método de Pago</label>
                <select 
                  value={nuevoMetodo}
                  onChange={(e) => setNuevoMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:bg-[#121016] text-slate-700 dark:text-zinc-300 font-medium"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape / Plin">Yape / Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 border border-slate-200 dark:border-purple-950/40 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-purple-950/10 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-purple-600 dark:bg-purple-500 text-white dark:text-[#121016] py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 rounded-lg transition-all"
                >
                  Guardar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR / CORREGIR EGRESO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#121016]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-[#121016] w-full max-w-md p-6 border border-slate-200 dark:border-purple-950/60 shadow-2xl rounded-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-md font-light uppercase tracking-widest text-slate-900 dark:text-white">
                Corregir Egreso
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateEgreso} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Monto (S/)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={editMonto}
                  onChange={(e) => setEditMonto(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-xl font-bold focus:outline-none focus:border-purple-600 dark:focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Categoría</label>
                <select 
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:bg-[#121016] text-slate-700 dark:text-zinc-300 font-medium"
                >
                  <option value="Compra de Productos">Compra de Productos</option>
                  <option value="Pagos de Servicios">Pagos de Servicios</option>
                  <option value="Imprevistos">Imprevistos</option>
                  <option value="Devoluciones">Devoluciones</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Descripción / Motivo</label>
                <input 
                  type="text" 
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 text-slate-400 dark:text-zinc-500 font-bold">Método de Pago</label>
                <select 
                  value={editMetodo}
                  onChange={(e) => setEditMetodo(e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 dark:border-purple-950/40 p-2 text-sm focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 dark:bg-[#121016] text-slate-700 dark:text-zinc-300 font-medium"
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Yape / Plin">Yape / Plin</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-1/2 border border-slate-200 dark:border-purple-950/40 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-purple-950/10 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-purple-600 dark:bg-purple-500 text-white dark:text-[#121016] py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 rounded-lg transition-all"
                >
                  Actualizar Egreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Egresos;