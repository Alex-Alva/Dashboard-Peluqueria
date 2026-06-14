import React from 'react';
import { 
  Pencil, Trash2, User, Scissors, X, AlignLeft, 
  Calendar, DollarSign, Save, RotateCcw 
} from 'lucide-react';
import { useDetalleCita, formatTime } from './hook/useDetalleCita';
const STATUS_COLORS = {
  Realizada: 'bg-green-500/20 text-green-600 dark:text-green-400',
  Cancelada: 'bg-red-500/20 text-red-600 dark:text-red-400',
  Pendiente: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
  Confirmada: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
};

const DetalleCita = ({ isOpen, onClose, cita, onUpdate, onDelete }) => {
  const {
    isEditing, setIsEditing, editData, mensaje,
    handleChange, handleSave, cancelarEdicion
  } = useDetalleCita(cita, onUpdate);

  if (!cita) return null;

  return (
    <>
      {mensaje && (
        <div className="fixed top-5 right-5 z-[200] px-5 py-3 rounded-2xl bg-green-500 text-white font-bold shadow-2xl animate-in fade-in slide-in-from-top-4">
          {mensaje}
        </div>
      )}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50 bg-white dark:bg-[#121016] border-l dark:border-purple-950/40 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b dark:border-purple-950/40 flex justify-between items-center bg-gray-50/50 dark:bg-[#121016]/50">
          <div>
            <h3 className="text-lg font-bold dark:text-white">{isEditing ? 'Editando Cita' : 'Detalle de Cita'}</h3>
            <p className="text-xs text-gray-500">ID de cita: #{cita.id || 'N/A'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-purple-950/40 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6 h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar text-sm">
          <Section icon={<User size={20}/>} label="Cliente">
            {isEditing ? (
              <input name="title" value={editData.title || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md dark:text-white outline-none focus:border-purple-500" />
            ) : (
              <p className="font-semibold text-gray-900 dark:text-white text-base">{cita.title}</p>
            )}
          </Section>
          <Section icon={<Scissors size={20}/>} label="Servicio y Duración">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Servicio</p>
                {isEditing ? (
                  <input name="service" value={editData.service || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md dark:text-white outline-none focus:border-purple-500" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.service}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Duración</p>
                {isEditing ? (
                  <input name="duration" value={editData.duration || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md dark:text-white outline-none focus:border-purple-500" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.duration} min</p>
                )}
              </div>
            </div>
          </Section>
          <Section icon={<Calendar size={20}/>} label="Horario">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Inicio</p>
                {isEditing ? (
                  <input
                    type="time"
                    name="start"
                    value={
                      editData.start
                        ? new Date(editData.start)
                            .toLocaleTimeString(
                              'es-PE',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }
                            )
                        : ''
                    }
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md dark:text-white outline-none focus:border-purple-500"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{formatTime(cita.start)}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Fin estimado</p>
                <p className="text-gray-800 dark:text-gray-200 font-medium">{formatTime(cita.end)}</p>
              </div>
            </div>
          </Section>

          <Section icon={<DollarSign size={20}/>} label="Finanzas y Estado">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Precio</p>
                {isEditing ? (
                  <input type="number" name="price" value={editData.price || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md dark:text-white outline-none focus:border-purple-500" />
                ) : (
                  <p className="text-purple-600 dark:text-purple-400 font-bold text-lg">S/ {cita.price || '0.00'}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Estado</p>
                {isEditing ? (
                  <select name="status" value={editData.status || 'Pendiente'} onChange={handleChange} className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md text-xs dark:text-white outline-none focus:border-purple-500">
                    {['Pendiente', 'Confirmada', 'Realizada', 'Cancelada'].map(s => <option key={s} value={s} className="bg-[#121016]">{s}</option>)}
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${STATUS_COLORS[cita.status] || STATUS_COLORS.Pendiente}`}>
                    {cita.status || 'Pendiente'}
                  </span>
                )}
              </div>
            </div>
          </Section>

          <Section icon={<AlignLeft size={20}/>} label="Notas / Descripción">
            {isEditing ? (
              <textarea name="notes" value={editData.notes || ''} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-[#121016] border dark:border-purple-950/40 p-2 rounded-md resize-none dark:text-white outline-none focus:border-purple-500" />
            ) : (
              <p className="italic text-gray-500 dark:text-gray-400">{cita.notes || 'Sin notas adicionales.'}</p>
            )}
          </Section>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-white dark:bg-[#121016] border-t dark:border-purple-950/40">
          <div className="flex gap-3">
            {isEditing ? (
              <div key="editing-actions" className="flex flex-1 gap-3 w-full">
                <button 
                  onClick={cancelarEdicion} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border dark:border-purple-950/40 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-purple-950/20 transition"
                >
                  <RotateCcw size={16}/> Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-semibold hover:opacity-90 shadow-lg shadow-purple-500/20 transition"
                >
                  <Save size={16}/> Guardar
                </button>
              </div>
            ) : (
              <div key="viewing-actions" className="flex flex-1 gap-3 w-full">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-purple-600 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-500/5 transition"
                >
                  <Pencil size={16}/> Editar
                </button>
                <button 
                  onClick={() => onDelete(cita.id)} 
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20 transition"
                >
                  <Trash2 size={16}/> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Section = ({ icon, label, children }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">{label}</p>
      {children}
    </div>
  </div>
);

export default DetalleCita;