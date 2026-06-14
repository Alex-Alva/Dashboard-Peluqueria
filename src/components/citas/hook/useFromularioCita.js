import { useState, useEffect, useMemo } from 'react';
const MOCK_CLIENTES = [
  { id: 1, nombre: "Valeria Mendoza" },
  { id: 2, nombre: "Carlos Torres" },
  { id: 3, nombre: "Ana María Silva" },
  { id: 4, nombre: "Mauricio Rivas" },
  { id: 5, nombre: "Elena Delgado" },
];

const MOCK_SERVICIOS = [
  { id: 101, nombre: "Corte Premium", precio: 60, duracion: 45, descripcion: "Corte con lavado y perfilado de patillas", estado: true },
  { id: 102, nombre: "Balayage + Tinte", precio: 250, duracion: 120, descripcion: "Decoloración artesanal y baño de color", estado: true },
  { id: 103, nombre: "Manicure Express", precio: 40, duracion: 30, descripcion: "Limpieza y esmaltado rápido", estado: true },
  { id: 104, nombre: "Tratamiento Capilar", precio: 90, duracion: 60, descripcion: "Hidratación profunda con Óleo de Argán", estado: true },
];

const MOCK_CITAS = [
  { fecha: new Date().toISOString().split('T')[0], hora_inicio: "10:00", duracion_minutos: 60, estado: "Confirmada" },
  { fecha: new Date().toISOString().split('T')[0], hora_inicio: "14:30", duracion_minutos: 90, estado: "En espera" },
];

const generarHoras = () => {
  const horas = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 20) horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horas;
};

export const HORAS = generarHoras();

export const useFormularioCita = (isOpen, onClose) => {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const [formData, setFormData] = useState({
    clienteId: null,
    servicioId: null,
    fecha: '',
    horaInicio: '',
    duracionMinutos: 0,
    precio: 0,
    descripcion: '',
    estado: 'Pendiente'
  });
  useEffect(() => {
    if (isOpen) {
      obtenerClientes();
      obtenerServicios();
    }
  }, [isOpen]);
  useEffect(() => {
    if (formData.fecha) obtenerHorasOcupadas();
  }, [formData.fecha]);

  const obtenerClientes = () => {
    const ordenados = [...MOCK_CLIENTES].sort((a, b) => a.nombre.localeCompare(b.nombre));
    setClientes(ordenados);
  };

  const obtenerServicios = () => {
    const activos = MOCK_SERVICIOS.filter(s => s.estado === true);
    setServicios(activos);
  };

  const obtenerHorasOcupadas = () => {
    const citasDelDia = MOCK_CITAS.filter(
      cita => cita.fecha === formData.fecha && cita.estado !== "Cancelada"
    );

    const ocupadas = [];
    citasDelDia.forEach(cita => {
      const [hora, minuto] = cita.hora_inicio.split(":").map(Number);
      const inicio = new Date();
      inicio.setHours(hora, minuto, 0);
      
      const fin = new Date(inicio);
      fin.setMinutes(fin.getMinutes() + cita.duracion_minutos);

      let actual = new Date(inicio);
      while (actual < fin) {
        ocupadas.push(actual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        actual.setMinutes(actual.getMinutes() + 30);
      }
    });
    setHorasOcupadas(ocupadas);
  };

  const clientesFiltrados = useMemo(() => {
    if (!busquedaCliente || clienteSeleccionado) return [];
    return clientes.filter(c => c.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase()));
  }, [busquedaCliente, clientes, clienteSeleccionado]);

  const serviciosFiltrados = useMemo(() => {
    if (!busquedaServicio || servicioSeleccionado) return [];
    return servicios.filter(s => s.nombre?.toLowerCase().includes(busquedaServicio.toLowerCase()));
  }, [busquedaServicio, servicios, servicioSeleccionado]);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    setBusquedaCliente(cliente.nombre);
  };

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setFormData(prev => ({
      ...prev,
      servicioId: servicio.id,
      precio: servicio.precio || 0,
      duracionMinutos: servicio.duracion || 0,
      descripcion: servicio.descripcion || ''
    }));
    setBusquedaServicio(servicio.nombre);
  };

  const calcularHoraFin = () => {
    if (!formData.horaInicio || !formData.duracionMinutos) return '--:--';
    const [hora, minuto] = formData.horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(hora, minuto);
    fecha.setMinutes(fecha.getMinutes() + Number(formData.duracionMinutos));
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  const guardarCita = (e) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.servicioId || !formData.horaInicio) {
      alert("Por favor completa los campos obligatorios");
      return;
    }
    const nuevaCita = {
      cliente_id: formData.clienteId,
      servicio_id: formData.servicioId,
      fecha: formData.fecha,
      hora_inicio: formData.horaInicio,
      duracion_minutos: Number(formData.duracionMinutos),
      precio: Number(formData.precio),
      notas: formData.descripcion,
      estado: formData.estado
    };

    console.log("Nueva cita registrada localmente:", nuevaCita);

    setMensaje("Cita registrada correctamente");
    setTimeout(() => {
      onClose();
      setMensaje('');
      setFormData({
        clienteId: null,
        servicioId: null,
        fecha: '',
        horaInicio: '',
        duracionMinutos: 0,
        precio: 0,
        descripcion: '',
        estado: 'Pendiente'
      });
      setClienteSeleccionado(null);
      setServicioSeleccionado(null);
      setBusquedaCliente('');
      setBusquedaServicio('');
    }, 1500);
  };

  return {
    formData, setFormData,
    busquedaCliente, setBusquedaCliente,
    busquedaServicio, setBusquedaServicio,
    clientesFiltrados, serviciosFiltrados,
    clienteSeleccionado, servicioSeleccionado,
    horasOcupadas, mensaje,
    seleccionarCliente, seleccionarServicio,
    calcularHoraFin, guardarCita
  };
};