import React, { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Clock, Layers, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, TrendingDown } from "lucide-react";

export default function FormularioT({ isOpen, onClose, categorias = [] }) {
  const [form, setForm] = useState({
    nombre: "",
    costo: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
    estado: "activo",
    imagen: null
  });
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Calcular ganancia en tiempo real convirtiendo de forma segura a números
const ganancia =
  (parseFloat(form.precio) || 0) -
  (parseFloat(form.costo) || 0);

const esPerdida = ganancia < 0;

  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  if (!isOpen) return null;

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

const handleChange = (e) => {
  const { name, value, files } = e.target;

  setForm(prev => ({
    ...prev,
    [name]: files ? files[0] : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.descripcion ||
      !form.costo ||
      !form.precio ||
      !form.categoria_id ||
      !form.estado ||
      !form.stock ||
      !form.imagen
    ) {
      mostrarToast("Por favor, completa todos los campos obligatorios, incluyendo la imagen.", "warning");
      return;
    }
    mostrarToast("Producto registrado correctamente (Simulación)", "success");
    setForm({
      nombre: "",
      descripcion: "",
      costo: "",
      precio: "",
      categoria_id: "",
      estado: "activo",
      stock: "",
      imagen: null
    });
    setTimeout(() => {
      onClose();
    }, 1000);
  };
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      {/* Toast Notificación */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
          notificacion.tipo === 'warning' ? 'bg-purple-600/10 border-purple-600/30 text-purple-400' :
          'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button> 
        </div> 
      )}

      {/* Contenedor Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-purple-950/40 bg-white dark:bg-[#121016]/95 dark:backdrop-blur-md shadow-2xl text-slate-900 dark:text-slate-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-950/40 bg-slate-50/50 dark:bg-[#121016]/60 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Nuevo Producto
            </h2>
            <p className="text-sm text-slate-600 dark:text-purple-400/80 mt-1">
              Registra un nuevo producto en el sistema
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-purple-400 hover:bg-slate-100 dark:hover:bg-[#121016] border border-transparent dark:hover:border-purple-950/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-transparent bg-white dark:bg-transparent"
        >
          {/* Nombre */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-purple-600 dark:text-purple-500" />
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Champú Reestructurante Premium"
              className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Costo, Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-indigo-600 dark:text-indigo-400" />
                Costo (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="costo"
                value={form.costo}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 50.00"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600 dark:text-purple-500" />
                Precio Venta (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 85.00"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-purple-600 dark:text-purple-500" />
                Stock Disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="Ej: 24"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>
          </div>
          {/* Ganancia / Pérdida Calculada de forma Dinámica */}
          <div className={`rounded-2xl border-2 border-dashed transition-colors duration-300 p-4 ${
            esPerdida 
              ? "border-red-500/40 bg-red-500/5 dark:bg-red-500/10" 
              : "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg transition-colors ${esPerdida ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                  {esPerdida ? (
                    <TrendingDown className="text-red-500 dark:text-red-400" size={18} />
                  ) : (
                    <DollarSign className="text-emerald-600 dark:text-emerald-400" size={18} />
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {esPerdida ? "Margen de Pérdida:" : "Ganancia Estimada:"}
                </span>
              </div>
<span className={`text-2xl font-bold transition-colors ${
    esPerdida
      ? "text-red-500 dark:text-red-400"
      : "text-emerald-600 dark:text-emerald-400"
  }`}
>
  {ganancia}
</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-10">
              {esPerdida 
                ? "Alerta: El costo actual supera el precio de venta sugerido." 
                : "Se calcula automáticamente: Precio Venta - Costo"}
            </p>
          </div>
          {/* Imagen */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-purple-600 dark:text-purple-500" />
              Imagen del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016] p-4 text-slate-900 dark:text-white file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-purple-700 transition"
            />
          </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Layers size={16} className="text-purple-600 dark:text-purple-500" />
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-500" />
                Estado Inicial <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-purple-600 dark:text-purple-500" />
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              placeholder="Describe detalladamente las características..."
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Botón de Enviar (Efecto neón) */}
          <button
            type="submit"
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 p-4 font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  );
}