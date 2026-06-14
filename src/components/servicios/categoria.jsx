import React, { useState, useEffect, useMemo } from 'react';
import {
  Tag,
  Plus,
  MoreVertical
} from 'lucide-react';

import CategoriaFormulario from './formularios/categoriaFormulario';
import categoriasData from './datos/DatosCategoria';
import serviciosData from './datos/DatosServicios';

const STORAGE_KEY = 'categorias_servicios';

const CategorySidebar = ({
  onCategoriaChange,
  onCategoriasLoad
}) => {

  const cargarCategorias = () => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    const categoriasIniciales = [
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

    return categoriasIniciales;
  };

  const [categorias, setCategorias] = useState(cargarCategorias);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editId, setEditId] = useState(null);
  const [originalName, setOriginalName] = useState('');

  const categoriasConContador = useMemo(() => {
    return categorias.map(cat => {
      let cantidad = 0;

      if (cat.id === null) {
        cantidad = serviciosData.length;
      } else {
        cantidad = serviciosData.filter(
          service => service.categoria_id === cat.id
        ).length;
      }

      return {
        ...cat,
        cantidad
      };
    });
  }, [categorias]); 
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(categorias)
    );
  }, [categorias]);

  useEffect(() => {
    onCategoriasLoad?.(categoriasConContador);
  }, [categoriasConContador, onCategoriasLoad]);

  const seleccionarCategoria = (id) => {
    const nuevasCategorias = categorias.map(cat => ({
      ...cat,
      activo: cat.id === id
    }));

    setCategorias(nuevasCategorias);
    onCategoriaChange?.(id);
  };

  const handleNew = () => {
    setShowForm(prev => !prev);
    setEditId(null);
    setNewCat('');
    setOriginalName('');
    setMenuOpen(null);
  };

  const handleEdit = (cat) => {
    setShowForm(true);
    setNewCat(cat.nombre);
    setOriginalName(cat.nombre);
    setEditId(cat.id);
    setMenuOpen(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewCat('');
    setEditId(null);
    setOriginalName('');
  };

  const handleSave = () => {
    const nombreLimpio = newCat.trim();
    if (!nombreLimpio) return;

    const existe = categorias.some(cat =>
      cat.nombre.toLowerCase() === nombreLimpio.toLowerCase() &&
      cat.id !== editId
    );

    if (existe) return;

    if (editId !== null) {
      const updated = categorias.map(cat =>
        cat.id === editId
          ? { ...cat, nombre: nombreLimpio }
          : cat
      );
      setCategorias(updated);
    } else {
      const nuevaCategoria = {
        id: Date.now(),
        nombre: nombreLimpio,
        activo: false
      };

      setCategorias([
        ...categorias,
        nuevaCategoria
      ]);
    }

    handleCancel();
  };

  const handleDelete = (id) => {
    if (id === null) return;

    const updated = categorias.filter(
      cat => cat.id !== id
    );

    setCategorias(updated);
    setMenuOpen(null);
  };

  const isSaveDisabled = () => {
    const nombre = newCat.trim();
    if (!nombre) return true;

    if (
      editId !== null &&
      nombre === originalName.trim()
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-5 rounded-3xl bg-white dark:bg-[#121016] border border-purple-500/20 shadow-2xl">

      <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Tag
              className="text-purple-600 dark:text-purple-400"
              size={18}
            />
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-900 dark:text-gray-200">
            Categorías
          </h2>
        </div>

        <button
          onClick={handleNew}
          className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400"
        >
          <Plus size={16} />
        </button>
      </div>

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

      <ul className="space-y-1.5">
        {categoriasConContador.map((cat) => (
          <li
            key={cat.id ?? 'todos'}
            className="relative"
          >
            <div
              onClick={() => seleccionarCategoria(cat.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                transition-all duration-200 group cursor-pointer border
                ${
                  cat.activo
                    ? 'bg-purple-500/10 border-l-4 border-l-purple-600 border-purple-500/20 text-purple-700 dark:text-purple-400 font-bold'
                    : 'text-slate-600 dark:text-gray-400 border-transparent hover:bg-purple-500/10'
                }
              `}
            >
              <span className="text-sm tracking-wide">
                {cat.nombre}
              </span>

              <div className="flex items-center gap-2">
                <span
                  className={`
                    text-xs font-mono px-2 py-0.5 rounded-full
                    ${
                      cat.activo
                        ? 'bg-purple-500/20 text-purple-600'
                        : 'bg-slate-100 dark:bg-zinc-800 text-gray-400'
                    }
                  `}
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
                        p-1 rounded-lg hover:bg-purple-500/20 transition-all
                        ${menuOpen === cat.id ? 'opacity-100 text-purple-400' : 'md:opacity-0 md:group-hover:opacity-100 text-gray-400'}
                      `}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {menuOpen === cat.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-purple-500/20 rounded-xl shadow-2xl z-30 pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(cat);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-purple-500/10 first:rounded-t-xl"
                        >
                          Editar
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat.id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 last:rounded-b-xl"
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

export default CategorySidebar;