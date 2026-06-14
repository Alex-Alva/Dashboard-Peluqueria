/**
 * ============================================================================
 * CONTEXTO DE AUTENTICACIÓN
 * ============================================================================
 * Maneja el estado global de autenticación del usuario
 * - Validación simple de login (cualquier usuario/contraseña válidos por ahora)
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

  useEffect(() => {
    const savedAuth = localStorage.getItem('peluqueria_auth');
    const savedUser = localStorage.getItem('peluqueria_user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    if (email.trim() && password.trim()) {
      const user = {
        email: email,
        loginTime: new Date().toISOString(),
      };
      
      setIsAuthenticated(true);
      setCurrentUser(user);
      localStorage.setItem('peluqueria_auth', 'true');
      localStorage.setItem('peluqueria_user', JSON.stringify(user));
      
      return true;
    }
    
    return false;
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  
  return context;
}