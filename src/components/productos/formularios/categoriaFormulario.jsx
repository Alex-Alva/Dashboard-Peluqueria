import React from 'react';

const CategoriaFormulario = ({
  newCat,
  setNewCat,
  onSave,
  onCancel,
  isEditing,
  disabled
}) => {

  return (
    <div className="mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-violet-500/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

      <div>
        <input
          type="text"
          autoFocus
          value={newCat}
          onChange={(e) =>
            setNewCat(e.target.value)
          }
          placeholder="Nombre de la categoría"
          className="w-full p-3 rounded-xl text-sm bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all"
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !disabled
            ) {
              onSave();
            }
          }}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={disabled}
          className={`
            flex-1 text-xs font-bold py-2.5 rounded-xl transition-all
            ${
              disabled
                ? 'bg-gray-300 dark:bg-zinc-700 text-gray-500 cursor-not-allowed'
                : 'bg-violet-500 hover:bg-violet-600 text-white shadow-sm shadow-violet-500/10'
            }
          `}
        >
          {isEditing
            ? 'Actualizar'
            : 'Guardar'}
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-medium py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancelar
        </button>
      </div>

    </div>
  );
};

export default CategoriaFormulario;