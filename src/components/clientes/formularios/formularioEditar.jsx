import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, Save, RefreshCw, MessageSquare } from "lucide-react";

export default function FormularioEditar({ isOpen, onClose, onSubmit, cliente }) {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    correo: "",
    seguimiento: "" 
  });

  useEffect(() => {
    if (!cliente || !isOpen) return;

    const telefonoLimpio = cliente.telefono === "—" || cliente.numero === "—" 
      ? "" 
      : (cliente.telefono || cliente.numero || "");

    const correoLimpio = cliente.correo === "—" 
      ? "" 
      : (cliente.correo || "");

    setForm({
      nombre: cliente.nombre || "",
      numero: telefonoLimpio,
      correo: correoLimpio,
      seguimiento: cliente.seguimiento || "" 
    });

  }, [cliente, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] border border-purple-950/40 bg-white dark:bg-[#121016] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950/40 px-6 py-5 shrink-0 bg-gradient-to-b from-purple-600/[0.03] to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/10 rounded-xl border border-purple-500/20 text-purple-600 dark:text-purple-400">
              <RefreshCw size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-black dark:text-gray-200">Editar Perfil</h2>
              <p className="text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-wider font-semibold mt-0.5">Entorno Simulador</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-purple-500/10 transition text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
            <X size={16} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin scrollbar-thumb-purple-500/20">
          
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
              <User size={13} className="text-purple-600 dark:text-purple-400" /> Nombre Completo <span className="text-purple-500">*</span>
            </label>
            <input
              type="text"
              required 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange}
              placeholder="Ej: Gimena López"
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
              <Phone size={13} className="text-purple-600 dark:text-purple-400" /> Teléfono fijo / Móvil
            </label>
            <input
              type="text"
              name="numero" 
              value={form.numero} 
              onChange={handleChange}
              placeholder="Ej: 999888777"
              className="w-full text-xs font-mono rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
            />
          </div>

          {/* Correo */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
              <Mail size={13} className="text-purple-600 dark:text-purple-400" /> Email corporativo
            </label>
            <input
              type="email"
              name="correo" 
              value={form.correo} 
              onChange={handleChange}
              placeholder="Ej: cliente@correo.com"
              className="w-full text-xs rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 transition"
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-600 dark:text-zinc-400 flex items-center gap-2">
              <MessageSquare size={13} className="text-purple-600 dark:text-purple-400" /> Comentarios de seguimiento
            </label>
            <textarea
              name="seguimiento" 
              value={form.seguimiento} 
              onChange={handleChange} 
              rows={3}
              placeholder={cliente?.visitas === 0 ? "Inhabilitado: El cliente no cuenta con visitas registradas." : "Registra anotaciones técnicas del cliente..."}
              disabled={cliente?.visitas === 0}
              className={`w-full text-xs rounded-xl border border-gray-200 dark:border-purple-950/40 bg-transparent p-3.5 text-black dark:text-white outline-none focus:border-purple-500 dark:focus:border-purple-500 resize-none transition ${cliente?.visitas === 0 ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-zinc-900/40' : ''}`}
            />
          </div>

          {/* Botonera con degradado para acción principal */}
          <div className="flex gap-3 pt-4 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-50 dark:bg-white/5 font-bold text-gray-500 dark:text-gray-300 transition hover:bg-slate-100 dark:hover:bg-white/10 text-xs uppercase tracking-wider">
              Descartar
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 font-bold text-white flex items-center justify-center gap-2 transition hover:brightness-110 shadow-lg shadow-purple-500/10 text-xs uppercase tracking-wider">
              <Save size={14} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}