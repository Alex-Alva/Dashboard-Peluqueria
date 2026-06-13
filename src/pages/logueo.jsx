/**
 * ============================================================================
 * PÁGINA DE LOGIN - Autenticación de Usuario
 * ============================================================================
 * Pantalla de inicio de sesión con validación simple
 * - Acepta cualquier email y contraseña no vacíos
 * - Diseño glassmorphism con efectos bokeh
 * - Persistencia de sesión en localStorage
 * ============================================================================
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginCard() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Maneja el envío del formulario de login
   * Valida que ambos campos estén completos antes de autenticar
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación: ambos campos requeridos
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticación (opcional, para UX)
    setTimeout(() => {
      const success = login(email, password);
      
      if (!success) {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1a0033] px-4 py-12">
      {/* Fondos difuminados para simular las luces de bokeh de la imagen */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-purple-700/30 blur-[120px]" />
        <div className="absolute -right-20 -bottom-20 h-[600px] w-[600px] rounded-full bg-fuchsia-800/20 blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
      </div>

      {/* Contenedor Principal con Framer Motion */}
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/20 bg-white/5 p-8 md:p-12 backdrop-blur-xl shadow-2xl transition-shadow duration-300 hover:shadow-purple-500/10"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Encabezado e Icono */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full border border-white/40 p-2 text-white/80">
            <Sun className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="text-3xl font-normal tracking-wide text-white md:text-4xl">
           ¡Bienvenido de nuevo!
          </h2>
          <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/60">
            Inicia sesión para acceder a tus meditaciones guiadas, prácticas diarias y viaje personal.
          </p>
          <p>
            (puedes ingresar cualquier email y password en este momento)
          </p>
        </div>

        {/* Mensaje de error si falla la validación */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Formulario de autenticación */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {/* Input Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-light tracking-wider text-white/70 pl-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-white/40 focus:bg-white/10"
              required
            />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-light tracking-wider text-white/70 pl-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-2xl border border-white/20 bg-white/5 pl-4 pr-12 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-white/40 focus:bg-white/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Opciones extra (Remember me y Forgot password) */}
          <div className="flex items-center justify-between pt-1 text-xs text-white/70">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-0 focus:ring-offset-0 accent-purple-500"
              />
              <span className="font-light">Remember me</span>
            </label>
            <a href="#forgot" className="font-light hover:underline hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Botón de Submit con animación y estado de carga */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-white py-3.5 text-sm font-medium text-slate-900 shadow-md transition-colors hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando sesión...' : 'Log In'}
          </motion.button>
        </form>

        {/* Footer del card */}
        <div className="mt-8 text-center text-xs font-light text-white/60">
          Don't have an account?{' '}
          <a href="#signup" className="font-normal text-white hover:underline">
            Sign Up
          </a>
        </div>
      </motion.div>
    </div>
  );
}