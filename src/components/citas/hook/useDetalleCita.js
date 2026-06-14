import { useState, useEffect } from 'react';

export const useDetalleCita = (cita, onUpdate) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [mensaje, setMensaje] = useState('');
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
  const handleSave = () => {
    try {
      const horaInicio = new Date(editData.start).toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      const citaActualizada = {
        ...editData,
        status: editData.status,
        notes: editData.notes,
        price: Number(editData.price),
        duration: Number(editData.duration),
      };
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
export const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};