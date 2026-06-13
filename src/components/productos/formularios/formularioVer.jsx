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

export default function FormularioVer({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  console.log("Producto seleccionado en Ver:", product);

  const fechaFormateada = (() => {
    const rawFecha = product.fecha_registro; 
    
    if (!rawFecha) return "Fecha no disponible";

    const stringFecha = rawFecha.includes("T") 
      ? rawFecha 
      : `${rawFecha}T00:00:00`;

    const objetoFecha = new Date(stringFecha);

    if (isNaN(objetoFecha.getTime())) return rawFecha;

    return objetoFecha.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  })();

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
          border-purple-950/40
          bg-white
          dark:bg-[#121016]
          shadow-2xl
        "
      >
        {/* Decoración superior - Degradado Neón */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-500 to-purple-700" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-purple-950/20 dark:border-purple-950/40 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Detalles del Producto
            </h2>
            <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              Información completa del producto registrado
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-purple-600/10 dark:hover:bg-purple-600/20 transition"
          >
            <X className="text-purple-600 dark:text-purple-400" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div
          className="
            flex-1 
            overflow-y-auto 
            p-6 
            space-y-5
            scrollbar-thin
            scrollbar-thumb-purple-600/40
            scrollbar-track-transparent
          "
        >
          {/* Imagen */}
          {(product.imagen_url || product.imagen) && (
            <img
              src={product.imagen_url || product.imagen}
              alt={product.nombre}
              className="w-full h-64 object-cover rounded-2xl border border-purple-950/20 dark:border-purple-950/40"
            />
          )}

          {/* Nombre */}
          <div className="rounded-2xl border border-purple-950/20 bg-gradient-to-br from-slate-50 to-white dark:from-purple-600/[0.03] dark:to-white/[0.01] p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-600/10 border border-purple-600/20">
                <Tag className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-purple-700 dark:text-purple-400 font-bold">
                  Nombre del Producto
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {product.nombre}
                </h3>
              </div>
            </div>
          </div>

          {/* Costo, Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 border border-purple-950/20 bg-white dark:bg-white/[0.02] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-indigo-600/10">
                  <DollarSign className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">Costo</p>
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                S/ {product.costo || "0.00"}
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-purple-950/20 bg-white dark:bg-white/[0.02] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-600/10">
                  <DollarSign className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">Precio Venta</p>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                S/ {product.precio}
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-purple-950/20 bg-white dark:bg-white/[0.02] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-purple-600/10">
                  <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">Stock</p>
              </div>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {product.stock} unidades
              </p>
            </div>
          </div>

          {/* Ganancia Calculada */}
          <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-500/5 dark:to-emerald-500/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-600/10 border border-emerald-600/20">
                <DollarSign className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                  Ganancia por Unidad
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  S/ {product.ganancia !== undefined ? Number(product.ganancia).toFixed(2) : (Number(product.precio || 0) - Number(product.costo || 0)).toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Margen: {product.costo > 0 ? ((((product.precio || 0) - (product.costo || 0)) / (product.costo || 1)) * 100).toFixed(1) : "0"}%
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="rounded-2xl border border-purple-950/20 bg-white dark:bg-white/[0.02] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-purple-600/10">
                <FileText className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400">Descripción</p>
            </div>
            <p className="text-slate-900 dark:text-slate-300 leading-relaxed">
              {product.descripcion || "Este producto no tiene descripción registrada."}
            </p>
          </div>

          {/* Información extra */}
          <div className="rounded-2xl border border-dashed border-purple-950/30 p-5 bg-slate-50/50 dark:bg-purple-600/[0.02] mb-2">
            <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 mb-4">
              Información Adicional
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar size={16} />
                  <span>Fecha de Registro</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-300">{fechaFormateada}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Hash size={16} />
                  <span>ID del Sistema</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-300">
                  {product.id ? `#PROD-${product.id}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-500 to-purple-700" />
      </div>
    </div>
  );
}