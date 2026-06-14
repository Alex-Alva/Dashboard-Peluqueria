/**
 * ============================================================================
 * MODAL DE CONFIRMACIÓN - Cerrar Sesión
 * ============================================================================
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, userEmail }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#121016] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-purple-950/40"
            >
              <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-5 border-b border-slate-200 dark:border-purple-950/40">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Cerrar Sesión
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-purple-300/70 mt-1">
                      ¿Estás seguro de que deseas salir?
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-purple-950/30 transition-colors text-slate-400 dark:text-purple-400/60"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                {userEmail && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-950/40">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-purple-400/50 font-medium">
                        Sesión Activa
                      </p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-purple-200/80">
                    Si cierras sesión, perderás acceso al sistema hasta que vuelvas a iniciar sesión.
                  </p>
                  <ul className="space-y-1 text-xs text-slate-500 dark:text-purple-300/60 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span>Tus datos están seguros y guardados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span>Puedes volver a iniciar sesión cuando quieras</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-purple-950/40 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-purple-950/60 text-slate-700 dark:text-purple-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-purple-950/30 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
