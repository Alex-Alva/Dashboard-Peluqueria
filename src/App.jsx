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
import { motion } from "framer-motion";

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
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <motion.div
          animate={{ marginLeft: isOpen ? "220px" : "70px" }} 
          className="min-h-screen p-4"
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
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}