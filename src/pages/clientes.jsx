import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import ClientesHeader from '../components/clientes/header';
import FilterBar from '../components/clientes/filtros';
import ClientesTable from '../components/clientes/tabla';
import FormularioCliente from '../components/clientes/formularios/formulariocliente';
import FormularioEditar from '../components/clientes/formularios/formularioEditar';
import FormularioVer from '../components/clientes/formularios/formularioVer';

const Clientes = () => {
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({ search: '', frecuencia: '', visitas: '' });

  // Control centralizado de modales
  const [modalConfig, setModalConfig] = useState({ tipo: null, isOpen: false });
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estado para la notificación simulación (Toast global)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '' });

  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  const abrirModal = (tipo, cliente = null) => {
    setClienteSeleccionado(cliente);
    setModalConfig({ tipo, isOpen: true });
  };

  const cerrarModal = () => {
    setModalConfig({ tipo: null, isOpen: false });
    setTimeout(() => setClienteSeleccionado(null), 200);
  };

  const lanzarToast = (mensaje) => {
    setNotificacion({ visible: true, mensaje });
  };

  const handleSaveCliente = (nuevoCliente) => {
    setRefresh(prev => !prev); 
    lanzarToast("Cliente registrado correctamente (Simulación)");
    cerrarModal();
  };

  const handleUpdateCliente = (clienteEditado) => {
    lanzarToast("Cambios del cliente guardados con éxito (Simulación)");
    cerrarModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-600 dark:bg-[#121016] dark:text-purple-200 transition-colors duration-300 relative">
      
      {/* TOAST GLOBAL DEL PADRE - GLASSMORPHISM CON #121016/80 */}
      {notificacion.visible && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white/90 dark:bg-[#121016]/80 border-slate-200 dark:border-purple-950/40 text-purple-600 dark:text-purple-400">
          <CheckCircle2 size={18} />
          <p className="text-xs uppercase tracking-wider font-semibold">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* HEADER */}
        <ClientesHeader onOpenModal={() => abrirModal('crear')} />

        {/* FILTROS */}
        <section className="bg-white dark:bg-[#121016]/60 dark:backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-purple-950/40 shadow-sm overflow-hidden">
          <FilterBar filters={filters} setFilters={setFilters} />
        </section>

        {/* TABLA PRINCIPAL */}
        <main className="bg-white dark:bg-[#121016] rounded-2xl border border-slate-200 dark:border-purple-950/40 shadow-md overflow-hidden">
          <ClientesTable
            filters={filters}
            refresh={refresh}
            abrirModal={abrirModal}
          />
        </main>
      </div>

      {/* MODAL 1: FORMULARIO DE CREACIÓN */}
      <FormularioCliente
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'crear'}
        onClose={cerrarModal}
        onSubmit={handleSaveCliente}
      />

      {/* MODAL 2: FORMULARIO DE EDICIÓN */}
      <FormularioEditar
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'editar'}
        cliente={clienteSeleccionado}
        onClose={cerrarModal}
        onSubmit={handleUpdateCliente}
      />

      {/* MODAL 3: CAPA VISUAL DE DETALLES */}
      <FormularioVer
        isOpen={modalConfig.isOpen && modalConfig.tipo === 'ver'}
        cliente={clienteSeleccionado}
        onClose={cerrarModal}
      />
    </div>
  );
};

export default Clientes;