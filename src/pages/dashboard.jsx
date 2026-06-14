import React, { useState, useEffect } from 'react';

import MetricasGrid from '../components/dashboard/MetricasGrid';
import GraficoGanancias from '../components/dashboard/GraficoGanancias';
import GraficosCirculares from '../components/dashboard/GraficosCirculares';
import CitasPendientes from '../components/dashboard/CitasPendientes';

const datosGanancias = [
  { mes: 'Ene', ganancias: 4200 },
  { mes: 'Feb', ganancias: 5100 },
  { mes: 'Mar', ganancias: 4800 },
  { mes: 'Abr', ganancias: 6300 },
  { mes: 'May', ganancias: 7500 }, 
  { mes: 'Jun', ganancias: 7100 },
];

const datosProductos = [
  { name: 'Shampoo Gold', value: 45 },
  { name: 'Cera Mate', value: 30 },
  { name: 'Óleo Argán', value: 25 },
];

const datosServicios = [
  { name: 'Corte Premium', value: 55 },
  { name: 'Tinte & Color', value: 25 },
  { name: 'Tratamientos', value: 20 },
];

const citasPendientes = [
  { id: 1, cliente: 'Valeria Mendoza', servicio: 'Balayage + Tinte', hora: '14:30', estado: 'En espera' },
  { id: 2, cliente: 'Carlos Torres', servicio: 'Corte Premium', hora: '15:15', estado: 'Próximo' },
  { id: 3, cliente: 'Ana María Silva', servicio: 'Manicure Express', hora: '16:00', estado: 'Próximo' },
  { id: 4, cliente: 'Mauricio Rivas', servicio: 'Barba & Perfilado', hora: '17:00', estado: 'Pendiente' },
  { id: 5, cliente: 'Elena Delgado', servicio: 'Tratamiento Capilar', hora: '17:45', estado: 'Pendiente' },
];

export default function Dashboard() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#0d0b0f] dark:to-[#16131a] text-slate-800 dark:text-zinc-100 p-6 flex flex-col gap-6 select-none antialiased transition-colors duration-300">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
            Estadísticas Generales
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Monitoreo de ingresos, citas y rendimiento comercial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0">
          <MetricasGrid />
          <div className="p-4 bg-white dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm min-w-0 min-h-0 shadow-sm">
            <GraficoGanancias data={datosGanancias} />
          </div>
          <div className="p-4 bg-white dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm min-w-0 min-h-0 shadow-sm">
            <GraficosCirculares productos={datosProductos} servicios={datosServicios} isDark={isDark} />
          </div>
        </div>

        <div className="w-full bg-white dark:bg-[#121016]/80 border border-slate-200 dark:border-purple-950/40 rounded-sm p-4 shadow-sm min-w-0">
          <CitasPendientes citas={citasPendientes} />
        </div>

      </div>
    </div>
  );
}