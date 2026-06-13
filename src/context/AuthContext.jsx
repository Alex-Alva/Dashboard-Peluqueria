/**
 * ============================================================================
 * CONTEXTO DE AUTENTICACIÓN
 * ============================================================================
 * Maneja el estado global de autenticación del usuario
 * - Validación simple de login (cualquier usuario/contraseña válidos)
 * - Persistencia en localStorage
 * - Control de acceso a la aplicación
 * ============================================================================
 */

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem('peluqueria_auth');
    const savedUser = localStorage.getItem('peluqueria_user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  /**
   * Inicia sesión con cualquier email/contraseña (validación básica)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {boolean} - true si el login fue exitoso
   */
  const login = (email, password) => {
    // Validación simple: ambos campos deben estar completos
    if (email.trim() && password.trim()) {
      const user = {
        email: email,
        loginTime: new Date().toISOString(),
      };
      
      setIsAuthenticated(true);
      setCurrentUser(user);
      
      // Persistir en localStorage
      localStorage.setItem('peluqueria_auth', 'true');
      localStorage.setItem('peluqueria_user', JSON.stringify(user));
      
      return true;
    }
    
    return false;
  };

  /**
   * Cierra la sesión actual y limpia el almacenamiento
   */
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('peluqueria_auth');
    localStorage.removeItem('peluqueria_user');
  };

  const value = {
    isAuthenticated,
    isLoading,
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Objeto con estado y funciones de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
}