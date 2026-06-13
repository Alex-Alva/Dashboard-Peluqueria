import React, { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Clock, Layers, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function FormularioT({ isOpen, onClose, categorias = [] }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    duracion: "",
    categoria_id: "",
    descripcion: "",
    estado: "activo",
    imagen: null
  });

  // Estado para las mini notificaciones flotantes (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Auto-cerrar la notificación después de 4 segundos
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
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de seguridad visual por código
    if (
      !form.nombre ||
      !form.descripcion ||
      !form.precio ||
      !form.categoria_id ||
      !form.estado ||
      !form.duracion
    ) {
      mostrarToast("Por favor, completa todos los campos obligatorios", "warning");
      return;
    }

    /* NOTA DE MAQUETACIÓN:
       Se eliminó la lectura/escritura en localStorage y el callback 'onSubmit'.
       Los datos del nuevo servicio no se persistirán en ningún sitio, manteniendo el componente
       estrictamente enfocado en la interfaz de usuario.
    */

    // Simulación visual de éxito en el registro
    mostrarToast("Servicio registrado correctamente (Simulación)", "success");

    // Limpieza de los campos del formulario
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      estado: "activo",
      duracion: "",
      imagen: null
    });

    // Retraso controlado para que el usuario aprecie el Toast de éxito antes de cerrar el modal
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' :
          notificacion.tipo === 'warning' ? 'bg-yellow-600/10 border-yellow-600/30 text-yellow-600 dark:text-yellow-400' :
          'bg-red-500/10 border-red-500/30 text-red-500'
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
          border-purple-500/20
          bg-white
          dark:bg-[#121016]
          shadow-2xl
        "
      >
        {/* Barra decorativa superior */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-500/10 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Nuevo Servicio
            </h2>
            <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
              Registra un nuevo servicio en el sistema
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-purple-500/10 transition"
          >
            <X className="text-purple-600 dark:text-purple-400" />
          </button>
        </div>

        {/* Formulario con Scroll Interno */}
        <form
          onSubmit={handleSubmit}
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
          {/* Nombre */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-purple-600 dark:text-purple-400" />
              Nombre del Servicio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Ej: Lavado de Salón Completo"
              className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-white/[0.03] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Precio y duración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                Precio (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 120"
                className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-white/[0.03] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-purple-600 dark:text-purple-400" />
                Duración <span className="text-red-500">*</span>
              </label>
              <select
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-[#121016]/60 backdrop-blur-md p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
              >
                <option value="">Seleccionar duración</option>
                <option value="10">10 minutos</option>
                <option value="20">20 minutos</option>
                <option value="30">30 minutos</option>
                <option value="40">40 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora 30 min</option>
                <option value="120">2 horas</option>
                <option value="150">2 horas 30 min</option>
                <option value="180">3 horas</option>
              </select>
            </div>
          </div>

          {/* Imagen (Opcional) */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-purple-600 dark:text-purple-400" />
              Imagen del Servicio (Opcional)
            </label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-[#121016]/60 backdrop-blur-md p-4 text-slate-900 dark:text-white file:mr-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-purple-700 file:to-indigo-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:from-purple-600 hover:file:to-indigo-500 transition"
            />
          </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Layers size={16} className="text-purple-600 dark:text-purple-400" />
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-[#121016]/60 backdrop-blur-md p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
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
              <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400" />
                Estado Inicial <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-purple-500/20 bg-white dark:bg-[#121016]/60 backdrop-blur-md p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-purple-600 dark:text-purple-400" />
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              placeholder="Describe detalladamente el servicio..."
              className="w-full resize-none rounded-2xl border border-purple-500/20 bg-white dark:bg-white/[0.03] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 p-4 font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Guardar Servicio
          </button>
        </form>

        {/* Barra inferior decorativa */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700" />
      </div>
    </div>
  );
}