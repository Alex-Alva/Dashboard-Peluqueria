import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Search } from 'lucide-react';
import { 
  formatFechaLocal, 
  formatMoneda,
  estaEnRangoFechas,
  contieneTexto
} from '../../../common/utils';

const DATOS_MOCK_CITAS = [
  {
    id: 1,
    fecha: '2026-05-28',
    hora_inicio: '10:30:00',
    duracion_minutos: 45,
    precio: 85.00,
    estado: 'Realizada',
    notes: 'Cliente prefiere café americano durante el servicio.',
    clientes: { nombre: 'Alessandra Cavallero' },
    servicio: { nombre: 'Corte de Diseño & Styling' }
  },
  {
    id: 2,
    fecha: '2026-05-28',
    hora_inicio: '11:45:00',
    duracion_minutos: 90,
    precio: 210.00,
    estado: 'Realizada',
    notes: 'Tinte libre de amoníaco.',
    clientes: { nombre: 'Mauricio de la Fuente' },
    servicio: { nombre: 'Coloración Premium Elixir' }
  },
  {
    id: 3,
    fecha: '2026-05-29',
    hora_inicio: '09:00:00',
    duracion_minutos: 30,
    precio: 60.00,
    estado: 'Cancelada',
    notes: 'Canceló por viaje de urgencia de última hora.',
    clientes: { nombre: 'Fiorella Bernasconi' },
    servicio: { nombre: 'Perfilado de Cejas & Spa Facial' }
  },
  {
    id: 4,
    fecha: '2026-05-30',
    hora_inicio: '15:00:00',
    duracion_minutos: 60,
    precio: 130.00,
    estado: 'Realizada',
    notes: 'Tratamiento hidratante complementario.',
    clientes: { nombre: 'Gianluca Rossi' },
    servicio: { nombre: 'Terapia Capilar Hidratante' }
  },
  {
    id: 5,
    fecha: '2026-05-31',
    hora_inicio: '17:30:00',
    duracion_minutos: 40,
    precio: 75.00,
    estado: 'Cancelada',
    notes: 'Inasistencia sin previo aviso.',
    clientes: { nombre: 'Valeria Mendoza' },
    servicio: { nombre: 'Manicure Luxury Gel' }
  }
];

export default function Citas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const formatFechaManual = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatHora = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  const fetchCitasHistoricas = () => {
    setLoading(true);
    setTimeout(() => {
      setCitas(DATOS_MOCK_CITAS);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchCitasHistoricas();
  }, []);

  const citasFiltradas = citas.filter(c => {
    if (filtroEstado !== 'Todos' && c.estado !== filtroEstado) return false;

    const nombreCliente = c.clientes?.nombre || 'Cliente General';
    if (!contieneTexto(nombreCliente, busquedaCliente)) {
      return false;
    }
    if (!estaEnRangoFechas(c.fecha, fechaInicio, fechaFin)) return false;

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-transparent transition-colors text-slate-600 dark:text-purple-100/80 animate-fadeIn">
      <div className="mb-6 p-4 bg-slate-50 dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm flex flex-wrap gap-6 items-center">
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-slate-400 dark:text-purple-400/50">
          <Filter size={14} className="text-purple-600 dark:text-purple-400" />
          Auditoría de Citas:
        </div>
        <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#121016]/60 border border-slate-200 dark:border-purple-950/60 px-3 py-1.5 rounded-sm w-full sm:w-64">
          <Search size={14} className="opacity-40 text-slate-400 dark:text-purple-400" />
          <input 
            type="text" 
            placeholder="Buscar cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="bg-transparent outline-none w-full text-slate-900 dark:text-white font-light"
          />
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
            <option value="Todos">Ver Todas</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        {(busquedaCliente || fechaInicio || fechaFin || filtroEstado !== 'Todos') && (
          <button 
            onClick={() => { setBusquedaCliente(''); setFechaInicio(''); setFechaFin(''); setFiltroEstado('Todos'); }}
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
              <th className="p-4 font-medium">Cliente</th>
              <th className="p-4 font-medium">Tratamiento / Servicio</th>
              <th className="p-4 font-medium">Planificación</th>
              <th className="p-4 font-medium">Duración</th>
              <th className="p-4 text-right font-medium">Costo</th>
              <th className="p-4 text-center font-medium">Flujo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-slate-700 dark:text-purple-200/80">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  Cargando historial de agenda...
                </td>
              </tr>
            ) : citasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-xs uppercase tracking-widest opacity-50 text-slate-400 dark:text-purple-400/40">
                  No se encontraron citas finalizadas o canceladas
                </td>
              </tr>
            ) : (
              citasFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors">
                  <td className="p-4 font-medium text-slate-900 dark:text-white text-xs">
                    {c.clientes?.nombre || 'Cliente General'}
                  </td>
                  <td className="p-4 text-xs tracking-wide">
                    <span className="font-light text-slate-800 dark:text-purple-100">
                      {c.servicio?.nombre || 'Servicio Desconocido'}
                    </span>
                    {c.notas && (
                      <span className="block text-[11px] text-slate-400 dark:text-purple-400/40 italic font-light truncate max-w-xs mt-0.5">
                        Nota: {c.notas}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-light">
                    {formatFechaLocal(c.fecha, { includeTime: false })} a las <span className="font-normal">{formatHora(c.hora_inicio)}</span>
                  </td>
                  <td className="p-4 text-xs font-light opacity-70">
                    {c.duracion_minutos || 0} min
                  </td>
                  <td className="p-4 text-right text-purple-700 dark:text-purple-400 font-semibold">
                    {formatMoneda(c.precio)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-0.5 text-[9px] uppercase font-medium rounded-sm tracking-wider ${
                      c.estado === 'Realizada' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {c.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}