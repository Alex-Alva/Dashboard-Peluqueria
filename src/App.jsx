import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginCard from "./pages/logueo";
import Sidebar from "./common/sidebar";
import Venta from "./pages/venta";
import Servicios from "./pages/servicios";
import Productos from "./pages/productos";
import Clientes from "./pages/clientes";
import Citas from "./pages/citas";
import FinanzasGeneral from "./pages/finanzas";
import HistoryGeneral from "./pages/historial";
import Dashboard from "./pages/dashboard";
import Configuracion from "./pages/configuracion";
import { motion } from "framer-motion";

/**
 * Componente interno que maneja la lógica de autenticación
 * Muestra login si no está autenticado, o la app completa si lo está
 */
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a0033]">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginCard />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 dark:bg-[#0f0f0f] transition-colors duration-300">
        {/* Sidebar de navegación */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Contenedor de páginas con margen adaptativo controlado puramente por Framer Motion */}
        <motion.div
          animate={{ marginLeft: isOpen ? "220px" : "70px" }} 
          className="min-h-screen p-4" // 👈 Removido 'transition-all' para evitar conflicto de lag
        >
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/venta" element={<Venta />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/finanzas" element={<FinanzasGeneral />} />
            <Route path="/historial" element={<HistoryGeneral />} />
            <Route path="/configuracion" element={<Configuracion/>} />
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
}
/**
 * Componente raíz que envuelve la app con el proveedor de autenticación
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}