import React, { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Clock, Layers, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";

export default function FormularioEditar({ isOpen, onClose, product, onSubmit, categorias = [] }) {
  const [form, setForm] = useState({
    nombre: "",
    costo: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
  });

  const [imagenFile, setImagenFile] = useState(null);
  const [imagenUrlPrevia, setImagenUrlPrevia] = useState(""); 
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Calcular ganancia en tiempo real
  const gananciaCalculada = form.precio && form.costo 
    ? (Number(form.precio) - Number(form.costo)).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre ?? "",
        costo:
          product.costo !== undefined &&
          product.costo !== null
            ? String(product.costo)
            : "",
        precio:
          product.precio !== undefined &&
          product.precio !== null
            ? String(product.precio)
            : "",
        stock:
          product.stock !== undefined &&
          product.stock !== null
            ? String(product.stock)
            : "",
        categoria_id:
          product.categoria_id !== undefined &&
          product.categoria_id !== null
            ? String(product.categoria_id)
            : "",
        descripcion: product.descripcion ?? "",
      });
      setImagenUrlPrevia(product.imagen_url || product.imagen || "");
      setImagenFile(null);
    }
  }, [product]);

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value }); 
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setImagenUrlPrevia(URL.createObjectURL(file));
      mostrarToast("Nueva imagen cargada para reemplazo", "success");
    }
  };

  const handleEliminarImagen = () => {
    setImagenFile(null);
    setImagenUrlPrevia(""); 
    mostrarToast("Imagen eliminada de la vista. Sube una nueva.", "warning");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.costo ||
      !form.precio ||
      !form.categoria_id ||
      form.stock === "" ||
      !imagenUrlPrevia 
    ) {
      mostrarToast("Por favor, completa todos los campos obligatorios, incluyendo la imagen.", "warning");
      return;
    }
    mostrarToast("Producto actualizado correctamente (Simulación)", "success");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
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
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Editar Producto 
              <span className="text-xs font-normal text-purple-600 dark:text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full ml-2 bg-purple-500/5">
                Simulador
              </span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-purple-400/80 mt-1">
              Modifica la información del producto (Prueba de flujo)
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
              placeholder="Ej: Kit de Barbería profesional"
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
                placeholder="Ej: 180"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-purple-600 dark:text-purple-500" />
                Precio Venta <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Ej: 320"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-purple-600 dark:text-purple-500" />
                Stock disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="Ej: 4"
                className="w-full rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
              />
            </div>  
          </div>

          {/* Ganancia Calculada (Solo Lectura) */}
          <div className="rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <DollarSign className="text-emerald-600 dark:text-emerald-400" size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Ganancia Estimada:
                </span>
              </div>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                 {gananciaCalculada}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-10">
              Se calcula automáticamente: Precio Venta - Costo
            </p>
          </div>

          {/* Imagen */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-purple-600 dark:text-purple-500" />
              Imagen del Producto <span className="text-red-500">*</span>
            </label>
            {!imagenUrlPrevia ? (
              <div className="animate-in fade-in duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  required
                  className="w-full rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 p-8 text-center text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-[#121016] dark:file:bg-purple-600 file:px-4 file:py-2 file:text-white dark:file:text-white file:font-semibold hover:file:bg-purple-700 dark:hover:file:bg-purple-700 file:cursor-pointer cursor-pointer transition"
                />
              </div>
            ) : (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/60 p-2 flex items-center gap-4 animate-in fade-in duration-200">
                <img
                  src={imagenUrlPrevia}
                  alt="Vista previa"
                  className="h-24 w-24 object-cover rounded-xl border border-slate-200 dark:border-purple-950/30"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=240";
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Imagen del producto</p>
                  <p className="text-xs text-slate-500 dark:text-purple-400/60 mt-0.5 font-mono max-w-[200px] truncate">
                    {product?.imagen_url ? "URL Vinculada" : "Archivo Local Temporal"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleEliminarImagen}
                  className="mr-2 p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center shrink-0"
                  title="Eliminar imagen"
                >
                  <Trash2 size={18} />
                </button> 
              </div> 
            )} 
          </div>

          {/* Categoría */}
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
              {categorias
                .filter(
                  (cat) =>
                    cat.id !== null &&
                    cat.nombre.toLowerCase() !== "todos"
                )
                .map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.nombre}
                  </option>
                ))}
            </select>
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
              placeholder="Describe las características del producto..."
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
          </div>

          {/* Botón de envío (Efecto neón) */}
          <button
            type="submit"
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 p-4 font-bold text-white transition hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Simular Actualización
          </button>
        </form>
      </div>
    </div>
  );
}