import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, UserPlus, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function FormularioCliente({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    correo: "",
  });

  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  if (!isOpen && !notificacion.visible) return null;

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre) {
      mostrarToast("El nombre del cliente es estrictamente obligatorio.", "warning");
      return;
    }

    onSubmit(form);
    mostrarToast("Cliente registrado correctamente (Simulación)", "success");
    setForm({ nombre: "", numero: "", correo: "" });
    onClose();
  };

  return (
    <>
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-purple-600/10 border-purple-500/30 text-purple-600 dark:text-purple-400' :
          notificacion.tipo === 'warning' ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-500' :
          'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <p className="text-xs font-semibold uppercase tracking-wider">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] border border-purple-950/40 bg-white dark:bg-[#121016] shadow-2xl">
            <div className="flex items-center justify-between border-b border-purple-950/40 px-6 py-5 shrink-0 bg-gradient-to-b from-purple-600/[0.03] to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/10 rounded-xl border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <UserPlus size={15} />
                </div>
                <div>
                  <h2 className="text-sm font-bold tracking-widest uppercase text-black dark:text-gray-200">Nuevo Cliente</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Añadir registro al sistema</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-purple-500/10 transition text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin scrollbar-thumb-purple-500/20">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
                  <User size={13} className="text-purple-600 dark:text-purple-400" /> Nombre Completo <span className="text-purple-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
                  <Phone size={13} className="text-purple-600 dark:text-purple-400" /> Número de Contacto
                </label>
                <input
                  type="tel"
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                  placeholder="Ej. 900000000"
                  className="w-full text-xs font-mono rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
                  <Mail size={13} className="text-purple-600 dark:text-purple-400" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  name="correo"
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="cliente@ejemplo.com"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
                />
              </div>
              <div className="flex gap-3 pt-4 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-white/5 font-bold text-gray-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 transition text-xs uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 font-bold text-white flex items-center justify-center gap-2 transition hover:brightness-110 shadow-lg shadow-purple-500/10 text-xs uppercase tracking-wider"
                >
                  <Save size={14} /> Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}