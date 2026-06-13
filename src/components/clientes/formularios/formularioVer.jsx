import React, { useEffect, useState } from "react";
import { X, User, Phone, Mail, MessageSquare, Calendar, Award } from "lucide-react";

export default function FormularioVer({ isOpen, onClose, cliente }) {
  const [seguimientos, setSeguimientos] = useState([]);

  useEffect(() => {
    if (cliente && isOpen) {
      if (cliente.visitas > 0 && cliente.seguimiento) {
        setSeguimientos([
          {
            id: `seg-${cliente.id}`,
            nota: cliente.seguimiento,
            fecha: cliente.fecha_registro 
              ? `${cliente.fecha_registro}T10:00:00.000Z` 
              : new Date().toISOString()
          }
        ]);
      } else {
        setSeguimientos([]);
      }
    }
  }, [cliente, isOpen]);

  if (!isOpen || !cliente) return null;

  // Actualizado: Mapeo de estilos sin colores ámbar o amarillos
  const tipoStyles = {
    Nuevo: "text-slate-500 bg-slate-500/10 border-slate-500/20 dark:text-slate-400",
    Regular: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-400",
    Frecuente: "text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] border border-purple-950/40 bg-white dark:bg-[#121016] shadow-2xl">
        
        {/* Header con destello premium morado sutil */}
        <div className="flex items-center justify-between border-b border-purple-950/40 px-6 py-5 shrink-0 bg-gradient-to-b from-purple-600/[0.03] to-transparent">
          <h3 className="text-sm font-bold tracking-widest uppercase flex items-center gap-2.5 text-black dark:text-purple-300">
            <User size={16} className="text-purple-600 dark:text-purple-400" /> Ficha de Cliente
          </h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-purple-500/10 transition text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20">
          
          {/* Identidad */}
          <div className="text-center space-y-3">
            <p className="text-xl font-bold tracking-tight text-black dark:text-white">{cliente.nombre}</p>
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tipoStyles[cliente.frecuencia] || tipoStyles.Nuevo}`}>
              <Award size={10} className="stroke-[2.5]" />
              {cliente.frecuencia || "Nuevo"}
            </span>
          </div>

          {/* Estadísticas de visitas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-purple-950/40">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1">Visitas</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{cliente.visitas} <span className="text-xs font-medium text-gray-400">asistidas</span></p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-purple-950/40">
              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1"><Calendar size={10} /> Registro</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1">
                {cliente.fecha_registro ? new Date(cliente.fecha_registro).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          {/* Canales de Contacto */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-purple-950/20 bg-gray-50/50 dark:bg-white/[0.01]">
              <Phone size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">{cliente.numero || cliente.telefono || 'Sin teléfono asignado'}</p>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-purple-950/20 bg-gray-50/50 dark:bg-white/[0.01]">
              <Mail size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
              <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{cliente.correo || 'Sin correo registrado'}</p>
            </div>
          </div>

          {/* Historial Timeline */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <MessageSquare size={12} /> Notas de evolución
            </h4>
            <div className="space-y-2">
              {seguimientos.length > 0 ? (
                seguimientos.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-purple-500/[0.02] dark:bg-purple-500/[0.01] border-l-2 border-purple-600 text-xs shadow-sm animate-in slide-in-from-left-2 duration-200"
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {s.nota}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2.5 font-mono">
                      {new Date(s.fecha).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-5 rounded-xl bg-transparent border border-dashed border-gray-200 dark:border-purple-950/40 text-center">
                  <p className="text-xs text-gray-400 italic">No registra seguimientos (Historial limpio).</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}