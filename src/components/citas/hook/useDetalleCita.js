import { useState, useEffect } from 'react';

export const useDetalleCita = (cita, onUpdate) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [mensaje, setMensaje] = useState('');

  // Sincronizar datos cuando cambia la cita seleccionada
  useEffect(() => {
    if (cita) {
      setEditData(cita);
      setIsEditing(false);
    }
  }, [cita]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "start") {
      const fechaOriginal = new Date(editData.start)
        .toISOString()
        .split('T')[0];

      setEditData(prev => ({
        ...prev,
        start: `${fechaOriginal}T${value}:00`
      }));
      return;
    }

    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  // Guardado puramente local mediante callbacks
  const handleSave = () => {
    try {
      // Formateamos la hora de inicio por si tu UI o el estado padre lo necesitan corregido
      const horaInicio = new Date(editData.start).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Creamos el objeto con las propiedades parseadas tal como lo hacías con Supabase
      const citaActualizada = {
        ...editData,
        status: editData.status,
        notes: editData.notes,
        price: Number(editData.price),
        duration: Number(editData.duration),
        // Puedes guardar 'horaInicio' en una propiedad custom si tu componente lo requiere
      };

      // Enviamos los cambios directamente al componente padre
      if (onUpdate) {
        onUpdate(citaActualizada);
      }

      mostrarMensaje("Cita actualizada correctamente");
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la cita localmente:", error);
      mostrarMensaje("Error al actualizar cita");
    }
  };

  const cancelarEdicion = () => {
    setEditData(cita);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    editData,
    mensaje,
    handleChange,
    handleSave,
    cancelarEdicion,
  };
};

// Helper de formato optimizado (limpiado de duplicados)
export const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};