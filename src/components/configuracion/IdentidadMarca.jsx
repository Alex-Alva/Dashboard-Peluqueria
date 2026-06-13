import React from 'react';
import { Building2, Upload } from 'lucide-react';

export default function IdentidadMarca({ nombreSistema, setNombreSistema, logoUrl, handleLogoUpload }) {
  return (
    <div className="bg-white dark:bg-[#121016]/80 backdrop-blur-md border border-slate-200 dark:border-purple-950/40 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <Building2 className="text-emerald-600 dark:text-emerald-400" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Identidad de Marca
        </h2>
      </div>

      {/* Nombre del Sistema */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Nombre del Sistema
        </label>
        <input
          type="text"
          value={nombreSistema}
          onChange={(e) => setNombreSistema(e.target.value)}
          placeholder="Ej: Mi Peluquería"
          className="w-full rounded-xl border border-purple-500/20 bg-white dark:bg-white/[0.03] p-4 text-slate-900 dark:text-white outline-none transition focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-3">
          Logo del Sistema
        </label>
        <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 text-center hover:border-purple-500/60 transition-colors">
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <label htmlFor="logo-upload" className="cursor-pointer">
            {logoUrl ? (
              <div className="space-y-3">
                <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain mx-auto rounded-lg" />
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  Click para cambiar
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 mx-auto text-purple-600 dark:text-purple-400" />
                <p className="text-sm text-slate-600 dark:text-purple-300">
                  Click para cargar logo
                </p>
                <p className="text-xs text-slate-400 dark:text-purple-400/50">
                  PNG, JPG, SVG hasta 5MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
