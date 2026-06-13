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

    <div className="mb-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#121016]/40 backdrop-blur-md border border-purple-500/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">

      <div>
        <input
          type="text"
          autoFocus
          value={newCat}
          onChange={(e) =>
            setNewCat(e.target.value)
          }
          placeholder="Nombre de la categoría"
          className="w-full p-3 rounded-xl text-sm bg-white dark:bg-[#121016]/60 backdrop-blur-md border border-purple-500/20 dark:border-purple-950/40 text-slate-900 dark:text-white focus:border-purple-600 focus:ring-2 focus:ring-purple-500/10 outline-none transition-all"
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
                ? 'bg-slate-300 dark:bg-zinc-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-sm shadow-purple-500/10'
            }
          `}
        >
          {isEditing
            ? 'Actualizar'
            : 'Guardar'}
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-gray-300 text-xs font-medium py-2.5 rounded-xl hover:bg-slate-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancelar
        </button>

      </div>

    </div>
  );
};

export default CategoriaFormulario;