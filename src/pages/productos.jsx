import React, { useState, useMemo } from 'react';
import ProductosHeader from '../components/productos/header';
import CategorySidebar from '../components/productos/categoria';
import FilterBar from '../components/productos/filtros';
import ProductosTable from '../components/productos/tabla';
import FormularioT from '../components/productos/formularios/formularioTabla';

const Productos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([]);
  
  const [filters, setFilters] = useState({
    nombre: '',
    stock: '',
    precio: '',
    estado: ''
  });

  // 1. Memorizamos el filtro para que no se ejecute en cada micro-render del componente
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter(c => c.id !== 0 && c.nombre?.toLowerCase() !== 'todos');
  }, [categorias]);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0">
          <div className="h-full">
            <CategorySidebar
              onCategoriaChange={setCategoriaSeleccionada}
              onCategoriasLoad={setCategorias} 
              refresh={refresh}
            />
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex">
          <div className="w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800">
            
            <ProductosHeader onOpenModal={() => setOpenModal(true)} />

            <FilterBar filters={filters} setFilters={setFilters} />

            {/* Contenedor de la Tabla */}
            <div className="flex-1 flex flex-col">
              <ProductosTable
                filters={filters}
                categoriaSeleccionada={categoriaSeleccionada}
                refresh={refresh} // 2. Agregamos el puente de refresh igual que en servicios
                setRefresh={setRefresh}
                categorias={categorias}
              />
            </div>
          </div>
        </main>
      </div>

      {/* MODAL DE NUEVO PRODUCTO */}
      <FormularioT
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        categorias={categoriasFiltradas} // 3. Usamos la lista limpia y memorizada
      />
    </div>
  );
};

export default Productos;