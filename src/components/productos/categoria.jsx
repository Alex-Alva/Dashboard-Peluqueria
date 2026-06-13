import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  MoreVertical
} from 'lucide-react';

import CategoriaFormulario from './formularios/categoriaFormulario';
import categoriasData from './datos/DatosCategoria';
import productosData from './datos/DatosProductos';

const STORAGE_KEY = 'categorias_productos';

const CategoryProductos = ({
  onCategoriaChange,
  onCategoriasLoad
}) => {

  // 1. ✅ OPTIMIZADO: Inicialización Lazy. Carga síncrona al primer render
  const [categorias, setCategorias] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    return [
      {
        id: null,
        nombre: 'Todos',
        activo: true
      },
      ...categoriasData.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        activo: false
      }))
    ];
  });

  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editId, setEditId] = useState(null);
  const [originalName, setOriginalName] = useState('');

  // Lee los productos reales (del LocalStorage si existen) para que los contadores sean verídicos
  const productosActuales = useMemo(() => {
    try {
      const guardados = localStorage.getItem("productos");
      return guardados ? JSON.parse(guardados) : productosData;
    } catch {
      return productosData;
    }
  }, []); // Solo lee al montar el componente de categorías

  // 2. ✅ OPTIMIZADO: Estructura memorizada de forma segura
  const categoriasConContador = useMemo(() => {
    const totalProductos = productosActuales.length;
    
    return categorias.map(cat => {
      if (cat.id === null) {
        return { ...cat, cantidad: totalProductos };
      }
      
      const cantidad = productosActuales.filter(
        product => Number(product.categoria_id) === Number(cat.id)
      ).length;

      return { ...cat, cantidad };
    });
  }, [categorias, productosActuales]);

  // 3. ✅ OPTIMIZADO: Guardado controlado en LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias));
  }, [categorias]);

  // 4. ✅ CORREGIDO: Evita el bucle infinito controlando la emisión de los datos al padre
  // Usamos strings JSON para comparar si el contenido real mutó, ignorando cambios de referencia en memoria
  const stringVerificacion = JSON.stringify(categoriasConContador);
  
  useEffect(() => {
    onCategoriasLoad?.(categoriasConContador);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringVerificacion, onCategoriasLoad]);

  // SELECCIONAR
  const seleccionarCategoria = (id) => {
    setCategorias(prev => prev.map(cat => ({
      ...cat,
      activo: cat.id === id
    })));
    onCategoriaChange?.(id);
  };

  // NUEVA CATEGORIA
  const handleNew = () => {
    setShowForm(prev => !prev);
    setEditId(null);
    setNewCat('');
    setOriginalName('');
    setMenuOpen(null);
  };

  // EDITAR
  const handleEdit = (cat) => {
    setShowForm(true);
    setNewCat(cat.nombre);
    setOriginalName(cat.nombre);
    setEditId(cat.id);
    setMenuOpen(null);
  };

  // CANCELAR
  const handleCancel = () => {
    setShowForm(false);
    setNewCat('');
    setEditId(null);
    setOriginalName('');
  };

  // GUARDAR
  const handleSave = () => {
    const nombreLimpio = newCat.trim();
    if (!nombreLimpio) return;

    const existe = categorias.some(cat =>
      cat.nombre.toLowerCase() === nombreLimpio.toLowerCase() &&
      cat.id !== editId
    );

    if (existe) return;

    if (editId !== null) {
      setCategorias(prev => prev.map(cat =>
        cat.id === editId ? { ...cat, nombre: nombreLimpio } : cat
      ));
    } else {
      setCategorias(prev => [
        ...prev,
        { id: Date.now(), nombre: nombreLimpio, activo: false }
      ]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    if (id === null) return;
    setCategorias(prev => prev.filter(cat => cat.id !== id));
    setMenuOpen(null);
  };

  const isSaveDisabled = () => {
    const nombre = newCat.trim();
    if (!nombre) return true;
    return editId !== null && nombre === originalName.trim();
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-5 rounded-3xl bg-white dark:bg-[#121016] border border-purple-950/20 dark:border-purple-950/40 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-950/20 dark:border-purple-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/10 border border-purple-600/20">
            <Tag className="text-purple-600 dark:text-purple-400" size={18} />
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-gray-200">
            Categorías
          </h2> 
        </div>
        <button
          onClick={handleNew}
          className="p-2 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <CategoriaFormulario
          newCat={newCat}
          setNewCat={setNewCat}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editId !== null}
          disabled={isSaveDisabled()}
        /> 
      )}

      {/* LISTA DINÁMICA */}
      <ul className="space-y-1.5">
        {categoriasConContador.map((cat) => (
          <li key={cat.id ?? 'todos'} className="relative">
            <div
              onClick={() => seleccionarCategoria(cat.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                transition-all duration-200 group cursor-pointer border
                ${cat.activo
                  ? 'bg-purple-600/10 border-l-4 border-l-purple-600 border-purple-600/20 text-purple-700 dark:text-purple-400 font-bold'
                  : 'text-slate-600 dark:text-gray-400 border-transparent hover:bg-purple-600/10' 
                } `} 
            >
              <span className="text-sm tracking-wide">{cat.nombre}</span>

              <div className="flex items-center gap-2">
                <span
                  className={`
                    text-xs font-mono px-2 py-0.5 rounded-full
                    ${cat.activo
                      ? 'bg-purple-600/20 text-purple-600 dark:text-purple-400'
                      : 'bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-gray-400'
                    } `} 
                >
                  {cat.cantidad}
                </span>

                {cat.id !== null && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === cat.id ? null : cat.id);
                      }}
                      className={`
                        p-1 rounded-lg hover:bg-purple-600/20 transition-all
                        ${menuOpen === cat.id ? 'opacity-100 text-purple-400' : 'md:opacity-0 md:group-hover:opacity-100 text-slate-600 dark:text-gray-400'}
                      `}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menuOpen === cat.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#121016] border border-purple-950/20 dark:border-purple-950/40 rounded-xl shadow-2xl z-30 pointer-events-auto overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(cat);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-gray-200 hover:bg-purple-600/10" 
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                        >
                          Eliminar
                        </button>
                      </div> 
                    )} 
                  </div>
                )} 
              </div> 
            </div> 
          </li> 
        ))} 
      </ul> 
    </div> 
  );
};

export default CategoryProductos;