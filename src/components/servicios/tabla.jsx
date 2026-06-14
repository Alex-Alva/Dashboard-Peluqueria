import React, { useMemo, useState, useEffect } from 'react';

import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import FormularioVer from './formularios/formularioVer';
import FormularioEditar from './formularios/formularioEditar';
import FormularioT from './formularios/formularioTabla';
import serviciosData from './datos/DatosServicios';
import { 
  formatMoneda,
  toNumber,
  estaEnRangoNumerico
} from '../../common/utils';

const ServiceTable = ({
  filters,
  categoriaSeleccionada,
  categorias,
  setRefresh
}) => {

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const serviciosGuardados =
      JSON.parse(localStorage.getItem("servicios")) || serviciosData;

    setServices(serviciosGuardados);
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const coincideBusqueda =
        !filters?.nombre ||
        service.nombre
          .toLowerCase()
          .includes(filters.nombre.toLowerCase());

      const coincideCategoria =
        !categoriaSeleccionada ||
        service.categoria_id === categoriaSeleccionada;

      let coincideDuracion = true;
      if (filters?.duracion) {
        const d = service.duracion;
        if (filters.duracion === "0-30") coincideDuracion = d >= 0 && d <= 30;
        else if (filters.duracion === "31-60") coincideDuracion = d > 30 && d <= 60;
        else if (filters.duracion === "61-120") coincideDuracion = d > 60 && d <= 120;
        else if (filters.duracion === "120+") coincideDuracion = d > 120;
      }

      let coincidePrecio = true;
      if (filters?.precio) {
        const p = toNumber(service.precio, 0);
        if (filters.precio === "0-20") coincidePrecio = p <= 20;
        else if (filters.precio === "20-50") coincidePrecio = p > 20 && p <= 50;
        else if (filters.precio === "50-100") coincidePrecio = p > 50 && p <= 100;
        else if (filters.precio === "100+") coincidePrecio = p > 100;
      }

      let coincideEstado = true;
      if (filters?.estado) {
        const estadoBooleano = filters.estado === "true";
        coincideEstado = service.estado === estadoBooleano;
      }

      return coincideBusqueda && coincideCategoria && coincideDuracion && coincidePrecio && coincideEstado;
    });
  }, [services, filters, categoriaSeleccionada]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoriaSeleccionada]);

  const serviciosConCategoria = filteredServices.map(service => {
    const categoria = categorias.find(
      cat => Number(cat.id) === Number(service.categoria_id)
    );

    return {
      ...service,
      categoria: categoria?.nombre || 'Sin categoría'
    };
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(serviciosConCategoria.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = serviciosConCategoria.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const maxPageButtons = 5;
  const visiblePages = useMemo(() => {
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const closeModal = () => {
    setModalType(null);
    setSelectedService(null);
  };

  const handleToggleStatus = (id) => {
    const updated = services.map(service =>
      service.id === id
        ? { ...service, estado: !service.estado }
        : service
    );

    setServices(updated);
    localStorage.setItem("servicios", JSON.stringify(updated));
    
    if (setRefresh) setRefresh(prev => !prev);
  };

  const handleDelete = (id) => {
    const updated = services.filter(
      service => service.id !== id
    );

    setServices(updated);
    localStorage.setItem("servicios", JSON.stringify(updated));

    if (setRefresh) setRefresh(prev => !prev);
    closeModal();
  };

  const handleUpdate = async (updatedService) => {
    let imagenBase64 = updatedService.imagen_url;

    if (updatedService.imagen) {
      imagenBase64 = await convertirBase64(updatedService.imagen);
    }

    const servicioActualizado = {
      ...updatedService,
      imagen_url: imagenBase64
    };

    const updated = services.map(service =>
      service.id === servicioActualizado.id
        ? servicioActualizado
        : service
    );

    setServices(updated);
    localStorage.setItem("servicios", JSON.stringify(updated));

    if (setRefresh) setRefresh(prev => !prev);
    closeModal();
  };

  const convertirBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="w-full text-slate-800 dark:text-gray-300 font-sans p-4">
      <div className="w-full overflow-hidden rounded-3xl border border-purple-500/20 bg-slate-50 dark:bg-[#121016] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-purple-700 dark:text-purple-400 text-xs uppercase tracking-wider border-b border-purple-500/20 bg-purple-500/10">
                <th className="px-6 py-4 font-bold">Servicio</th>
                <th className="px-6 py-4 text-center font-bold">Precio</th>
                <th className="px-6 py-4 text-center font-bold">Duración</th>
                <th className="px-6 py-4 text-center font-bold">Categoría</th>
                <th className="px-6 py-4 text-center font-bold">Estado</th>
                <th className="px-6 py-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-purple-500/10">
              {currentItems.length > 0 ? (
                currentItems.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-purple-500/5 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-gray-100">
                      {service.nombre}
                    </td>

                    <td className="px-6 py-4 text-sm text-center font-bold text-purple-600 dark:text-purple-400">
                      {formatMoneda(service.precio)}
                    </td>

                    <td className="px-6 py-4 text-sm text-center font-medium">
                      {toNumber(service.duracion, 0)} min
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {service.categoria}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(service.id)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                            service.estado ? 'bg-gradient-to-r from-purple-700 to-indigo-600' : 'bg-slate-300 dark:bg-zinc-800'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                              service.estado ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
                            }`}
                          />
                        </button>
                        <span className="text-xs font-medium text-slate-500 dark:text-gray-400 w-12 text-left">
                          {service.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setModalType('view');
                          }}
                          className="p-2 border border-purple-500/20 rounded-xl hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setModalType('edit');
                          }}
                          className="p-2 border border-purple-500/20 rounded-xl hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setModalType('delete');
                          }}
                          className="p-2 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-400">
                    No se encontraron servicios registrados con estos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-purple-500/10 bg-purple-500/[0.02]">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Mostrando <span className="font-semibold text-slate-900 dark:text-white">{serviciosConCategoria.length > 0 ? startIndex + 1 : 0}</span> al{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(startIndex + itemsPerPage, serviciosConCategoria.length)}
            </span>{' '}
            de <span className="font-semibold text-slate-900 dark:text-white">{serviciosConCategoria.length}</span> servicios
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-purple-500/20 text-slate-500 dark:text-gray-400 hover:bg-purple-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  currentPage === pageNumber
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'border border-purple-500/10 hover:bg-purple-500/10 text-slate-600 dark:text-gray-400'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-purple-500/20 text-slate-500 dark:text-gray-400 hover:bg-purple-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <FormularioVer
        isOpen={modalType === 'view'}
        onClose={closeModal}
        service={selectedService}
      />

      <FormularioEditar
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        service={selectedService}
        onSubmit={handleUpdate}
        categorias={categorias}
      />
    </div>
  );
};

export default ServiceTable;