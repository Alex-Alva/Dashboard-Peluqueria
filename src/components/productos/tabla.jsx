import React, { useMemo, useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';

import FormularioVer from './formularios/formularioVer';
import FormularioEditar from './formularios/formularioEditar';
import productosData from './datos/DatosProductos';
import { 
  formatMoneda,
  toNumber
} from '../../common/utils';

const ProductosTable = ({
  filters,
  categoriaSeleccionada,
  categorias,
  setRefresh
}) => {

  // ESTADOS
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Carga inicial exclusivamente desde LocalStorage
  useEffect(() => {
    const productosGuardados =
      JSON.parse(localStorage.getItem("productos")) || productosData;
    setProductos(productosGuardados);
  }, []);

  // 1. FILTRADO MEMORIZADO
  const filteredProductos = useMemo(() => {
    return productos.filter(producto => {
      const coincideBusqueda =
        !filters?.nombre ||
        producto.nombre
          .toLowerCase()
          .includes(filters.nombre.toLowerCase());

      const coincideCategoria =
        !categoriaSeleccionada ||
        producto.categoria_id === categoriaSeleccionada;

      let coincideStock = true;
      if (filters?.stock && filters.stock.trim() !== '') {
        const limiteStock = toNumber(filters.stock, 0);
        const stockProducto = toNumber(producto.stock, 0);
        coincideStock = stockProducto <= limiteStock;
      }

      let coincidePrecio = true;
      if (filters?.precio) {
        const p = toNumber(producto.precio, 0);
        if (filters.precio === "0-20") coincidePrecio = p <= 20;
        else if (filters.precio === "20-50") coincidePrecio = p > 20 && p <= 50;
        else if (filters.precio === "50-100") coincidePrecio = p > 50 && p <= 100;
        else if (filters.precio === "100-200") coincidePrecio = p > 100 && p <= 200;
        else if (filters.precio === "300+") coincidePrecio = p > 300;
      }

      let coincideEstado = true;
      if (filters?.estado) {
        const estadoBooleano = filters.estado === "true";
        coincideEstado = producto.estado === estadoBooleano;
      }

      return coincideBusqueda && coincideCategoria && coincideStock && coincidePrecio && coincideEstado;
    });
  }, [productos, filters, categoriaSeleccionada]);

  // RESETEAR PÁGINA CUANDO CAMBIAN LOS FILTROS
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, categoriaSeleccionada]);

  // 2. ✅ OPTIMIZADO: Inyección de categorías memorizada
  const productosConCategoria = useMemo(() => {
    return filteredProductos.map(producto => {
      const categoria = categorias.find(
        cat => Number(cat.id) === Number(producto.categoria_id)
      );
      return {
        ...producto,
        categoria: categoria?.nombre || 'Sin categoría'
      };
    });
  }, [filteredProductos, categorias]);

  // CONFIGURACIÓN DE PAGINACIÓN
  const itemsPerPage = 5;
  const totalPages = useMemo(() => {
    return Math.ceil(productosConCategoria.length / itemsPerPage) || 1;
  }, [productosConCategoria.length]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  
  // 3. ✅ OPTIMIZADO: Segmentación de página actual memorizada
  const currentItems = useMemo(() => {
    return productosConCategoria.slice(startIndex, startIndex + itemsPerPage);
  }, [productosConCategoria, startIndex]);

  // LÓGICA DE VENTANA FLOTANTE DE PAGINACIÓN
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
    setSelectedProducto(null);
  };

  const handleToggleStatus = (id) => {
    const updated = productos.map(producto =>
      producto.id === id ? { ...producto, estado: !producto.estado } : producto
    );
    setProductos(updated);
    localStorage.setItem("productos", JSON.stringify(updated));
    if (setRefresh) setRefresh(prev => !prev);
  };

  const handleDelete = (id) => {
    const updated = productos.filter(producto => producto.id !== id);
    setProductos(updated);
    localStorage.setItem("productos", JSON.stringify(updated));
    if (setRefresh) setRefresh(prev => !prev);
    closeModal();
  };

  const handleUpdate = async (updatedProducto) => {
    let imagenBase64 = updatedProducto.imagen_url;

    if (updatedProducto.imagen) {
      imagenBase64 = await convertirBase64(updatedProducto.imagen);
    }

    const productoActualizado = {
      ...updatedProducto,
      imagen_url: imagenBase64
    };

    const updated = productos.map(producto =>
      producto.id === productoActualizado.id ? productoActualizado : producto
    );

    setProductos(updated);
    localStorage.setItem("productos", JSON.stringify(updated));
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
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans p-4">
      <div className="w-full overflow-hidden rounded-3xl border border-violet-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-violet-700 dark:text-violet-400 text-xs uppercase tracking-wider border-b border-violet-500/20 bg-violet-500/10">
                <th className="px-6 py-4 font-bold">Producto</th>
                <th className="px-6 py-4 text-center font-bold">Precio</th>
                <th className="px-6 py-4 text-center font-bold">Stock</th>
                <th className="px-6 py-4 text-center font-bold">Categoría</th>
                <th className="px-6 py-4 text-center font-bold">Estado</th>
                <th className="px-6 py-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-violet-500/10">
              {currentItems.length > 0 ? (
                currentItems.map((producto) => (
                  <tr key={producto.id} className="hover:bg-violet-500/5 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-black dark:text-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-violet-500/20 bg-gray-100 dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-sm">
                          {producto.imagen_url || producto.imagen ? (
                            <img 
                              src={producto.imagen_url || producto.imagen} 
                              alt={producto.nombre} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={18} className="text-violet-600 dark:text-violet-500/70" />
                          )}
                        </div>
                        <span className="truncate max-w-[180px] sm:max-w-none">
                          {producto.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-center font-bold text-violet-600 dark:text-violet-400">
                      {formatMoneda(producto.precio)}
                    </td>
                    <td className="px-6 py-4 text-sm text-center font-medium">
                      {toNumber(producto.stock, 0)} und
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-xl text-xs font-bold border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        {producto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(producto.id)}
                          className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 ${
                            producto.estado ? 'bg-violet-500' : 'bg-gray-300 dark:bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                            producto.estado ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                          }`} />
                        </button>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-left">
                          {producto.estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProducto(producto);
                            setModalType('view');
                          }}
                          className="p-2 border border-violet-500/20 rounded-xl hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 transition"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProducto(producto);
                            setModalType('edit');
                          }}
                          className="p-2 border border-violet-500/20 rounded-xl hover:bg-violet-500/10 text-violet-600 dark:text-violet-400 transition"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProducto(producto);
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
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-400">
                    No se encontraron productos registrados con estos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-violet-500/10 bg-violet-500/[0.02]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-semibold text-black dark:text-white">{productosConCategoria.length > 0 ? startIndex + 1 : 0}</span> al{' '}
            <span className="font-semibold text-black dark:text-white">
              {Math.min(startIndex + itemsPerPage, productosConCategoria.length)}
            </span>{' '}
            de <span className="font-semibold text-black dark:text-white">{productosConCategoria.length}</span> productos
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-violet-500/20 text-gray-500 dark:text-gray-400 hover:bg-violet-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  currentPage === pageNumber
                    ? 'bg-violet-500 text-white shadow-md shadow-violet-500/20'
                    : 'border border-violet-500/10 hover:bg-violet-500/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-violet-500/20 text-gray-500 dark:text-gray-400 hover:bg-violet-500/10 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <FormularioVer
        isOpen={modalType === 'view'}
        onClose={closeModal}
        product={selectedProducto} 
      />

      <FormularioEditar
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        product={selectedProducto} 
        onSubmit={handleUpdate}
        categorias={categorias}
      />
    </div>
  );
};

export default ProductosTable;