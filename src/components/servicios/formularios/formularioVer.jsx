import React from "react";
import {
  X,
  Calendar,
  Tag,
  Clock,
  DollarSign,
  FileText,
  Hash,
} from "lucide-react";

export default function FormularioVer({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null;

  const fechaFormateada = new Date(service.fecha_registro).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="
          relative
          w-full
          max-w-2xl
          max-h-[90vh] 
          flex flex-col
          overflow-hidden
          rounded-3xl
          border
          border-purple-500/30
          bg-white
          dark:bg-[#121016]
          shadow-2xl
        ">
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700" />
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-purple-500/10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Detalles del Servicio
            </h2>
            <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              Información completa del servicio registrado
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-purple-500/10 transition"
          >
            <X className="text-purple-600 dark:text-purple-400" />
          </button>
        </div>

        <div
          className="
            flex-1 
            overflow-y-auto 
            p-6 
            space-y-5
            scrollbar-thin
            scrollbar-thumb-purple-500/40
            scrollbar-track-transparent
          "
        >
          {service.imagen_url && (
            <img
              src={service.imagen_url}
              alt={service.nombre}
              className="w-full h-64 object-cover rounded-2xl border border-purple-500/20"
            />
          )}

          <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-50 to-white dark:from-purple-500/5 dark:to-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Tag className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold">
                  Nombre del Servicio
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {service.nombre}
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border border-purple-500/20 bg-white dark:bg-white/[0.03] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <DollarSign className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400">Precio</p>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                s/ {service.precio}
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-purple-500/20 bg-white dark:bg-white/[0.03] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-500/10">
                  <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400">Duración</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {service.duracion} min
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-white dark:bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <FileText className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-gray-400">Descripción</p>
            </div>
            <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
              {service.descripcion || "Este servicio no tiene descripción registrada."}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-purple-500/20 p-5 bg-purple-50/40 dark:bg-purple-500/[0.03] mb-2">
            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-4">
              Información Adicional
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>Fecha de Registro</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-gray-300">{fechaFormateada}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                  <Hash size={16} />
                  <span>ID del Sistema</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-gray-300">
                {service.id ? `#SERV-${service.id}` : "N/A"}
              </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700" />
      </div>
    </div>
  );
}