import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRightLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  Coins
} from 'lucide-react';

const CierreCaja = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toLocaleDateString('sv-SE') // Devuelve exactamente YYYY-MM-DD en hora local
  );
  const [loading, setLoading] = useState(true);
  const [baseInicial, setBaseInicial] = useState(150); // Monto inicial editable simulado

  // Valores calculados por el sistema para ese día
  const [datosSistema, setDatosSistema] = useState({
    ingresos: 0,
    egresos: 0,
    metodos: {
      efectivo: 0,
      yape: 0,
      plin: 0,
      tarjeta: 0
    }
  });

  // 2. ESTADOS DEL FORMULARIO DE CUADRE (Valores ingresados por el cajero)
  const [valoresContados, setValoresContados] = useState({
    efectivo: '',
    yape: '',
    plin: '',
    tarjeta: ''
  });

  // ==========================================
  // 3. GENERACIÓN DE DATOS SIMULADOS COMPATIBLE
  // ==========================================
  const fetchDatosDelDia = async () => {
    setLoading(true);
    
    // Simulamos un retraso de red de 400ms para mantener el feeling de carga real
    await new Promise(resolve => setTimeout(resolve, 400));

    // Extraemos el día de forma segura basándonos en el string local "YYYY-MM-DD"
    // Esto evita que JavaScript reste un día por la zona horaria al usar new Date()
    const partes = fechaSeleccionada.split('-');
    const diaNum = partes[2] ? parseInt(partes[2], 10) : 15;
    
    const egresosSimulados = (diaNum % 3 === 0) ? 45.00 : 15.50;
    const metodosSimulados = {
      efectivo: 120.00 + (diaNum * 5),
      yape: 85.00 + (diaNum * 3),
      plin: 30.00 + (diaNum * 2),
      tarjeta: 210.00 + (diaNum * 4)
    };

    const ingresosSimulados = Object.values(metodosSimulados).reduce((a, b) => a + b, 0);

    setDatosSistema({
      ingresos: ingresosSimulados,
      egresos: egresosSimulados,
      metodos: metodosSimulados
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchDatosDelDia();
  }, [fechaSeleccionada]);

  // ==========================================
  // 4. CÁLCULOS DERIVADOS DE GANANCIA Y DIFERENCIAS
  // ==========================================
  const gananciaDia = datosSistema.ingresos - datosSistema.egresos;
  const saldoCajaEsperado = Number(baseInicial) + datosSistema.ingresos - datosSistema.egresos;

  // Manejar el cambio en los inputs de validación física
  const handleInputChange = (metodo, valor) => {
    setValoresContados(prev => ({
      ...prev,
      [metodo]: valor
    }));
  };

  // Calcular diferencias método por método
  const calcularDiferencia = (metodo) => {
    const contado = parseFloat(valoresContados[metodo]) || 0;
    const esperado = datosSistema.metodos[metodo];
    return contado - esperado;
  };

  // Calcular diferencia total global
  const diferenciaTotalGlobal = Object.keys(datosSistema.metodos).reduce((acc, metodo) => {
    const contado = parseFloat(valoresContados[metodo]) || 0;
    const esperado = datosSistema.metodos[metodo];
    return acc + (contado - esperado);
  }, 0);

  // ==========================================
  // 5. ACCIÓN FINAL: COMPORTAMIENTO SIMULADO
  // ==========================================
  const handleCerrarCaja = () => {
    alert(`¡Caja cerrada con éxito de manera simulada!\n\n` + 
          `Diferencia final registrada: S/ ${diferenciaTotalGlobal.toFixed(2)}`);
    
    // Limpiar los campos del formulario tras un cierre exitoso
    setBaseInicial(150);
    setValoresContados({
      efectivo: '',
      yape: '',
      plin: '',
      tarjeta: ''
    });

    fetchDatosDelDia();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121016] p-8 text-slate-800 dark:text-zinc-100 transition-colors duration-300">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between gap-6 mb-12 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-slate-900 dark:text-white">
            Cierre de Caja <span className="text-purple-600 dark:text-purple-400">.</span>
          </h1>

          <div className="flex items-center gap-2 mt-3 bg-white dark:bg-[#121016]/40 border border-slate-200 dark:border-purple-950/40 px-3 py-1.5 rounded-lg shadow-sm">
            <Calendar size={14} className="text-purple-600 dark:text-purple-400" />
            <input 
              type="date" 
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="bg-transparent text-xs uppercase tracking-wider outline-none dark:text-white text-slate-800 font-medium cursor-pointer" 
            />
          </div>
        </div>

        <button 
          onClick={handleCerrarCaja}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white dark:text-[#121016] px-8 py-3 rounded-lg flex items-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all font-bold uppercase text-xs tracking-widest shadow-lg shadow-purple-600/10 dark:shadow-purple-500/5"
        >
          <Lock size={16} />
          Finalizar y Cerrar Caja
        </button>
      </header>

      {/* TARJETAS RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-[#121016]/40 p-6 border-b-2 border-slate-200 dark:border-purple-950/20 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-medium">Ingresos Totales</p>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">S/ {datosSistema.ingresos.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#121016]/40 p-6 border-b-2 border-rose-500/50 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-medium">Egresos Totales</p>
            <TrendingDown className="text-rose-500" size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">- S/ {datosSistema.egresos.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#121016]/40 p-6 border-b-2 border-purple-600 dark:border-purple-400 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-medium">Ganancia Neta (Día)</p>
            <Wallet className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">S/ {gananciaDia.toFixed(2)}</h2>
        </div>

        <div className="bg-white dark:bg-[#121016]/40 p-6 border-b-2 border-blue-500/50 shadow-sm rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-medium">Base Apertura</p>
            <Coins className="text-blue-500 dark:text-blue-400" size={20} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-semibold opacity-60">S/</span>
            <input 
              type="number" 
              step="0.01"
              value={baseInicial} 
              onChange={(e) => setBaseInicial(e.target.value)}
              className="text-2xl font-bold tracking-tight bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 w-full text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CUADRE MÉTODO POR MÉTODO */}
      {loading ? (
        <div className="p-10 text-center uppercase tracking-widest text-xs font-semibold text-slate-400 dark:text-zinc-500">
          Calculando montos del sistema...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* TABLA IZQUIERDA: VALIDACIÓN DETALLADA */}
          <div className="lg:col-span-8 bg-white dark:bg-[#121016]/20 border border-slate-100 dark:border-purple-950/30 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50/50 dark:bg-[#121016]/60 border-b border-slate-100 dark:border-purple-950/30 flex items-center gap-2">
              <ArrowRightLeft size={16} className="text-purple-600 dark:text-purple-400" />
              <h4 className="text-xs uppercase tracking-widest font-bold text-slate-700 dark:text-zinc-300">Desglose e Inspección de Canales</h4>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-purple-950/20 text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold">
                  <th className="p-4">Método</th>
                  <th className="p-4 text-right">Monto en Sistema</th>
                  <th className="p-4 text-center w-48">Monto Real Contado (S/)</th>
                  <th className="p-4 text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-950/20 text-sm">
                {Object.keys(datosSistema.metodos).map((metodo) => {
                  const dif = calcularDiferencia(metodo);
                  return (
                    <tr key={metodo} className="hover:bg-slate-50/50 dark:hover:bg-purple-950/10 transition-colors">
                      <td className="p-4 font-semibold uppercase tracking-wider text-xs text-slate-700 dark:text-zinc-300">{metodo}</td>
                      <td className="p-4 text-right font-medium text-slate-600 dark:text-zinc-400">S/ {datosSistema.metodos[metodo].toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={valoresContados[metodo]}
                          onChange={(e) => handleInputChange(metodo, e.target.value)}
                          className="w-32 bg-slate-50 dark:bg-[#121016]/50 border-b border-slate-200 dark:border-purple-950/40 px-2 py-1 text-right focus:outline-none focus:border-purple-600 dark:focus:border-purple-400 font-semibold text-slate-900 dark:text-white rounded-t-md"
                        />
                      </td>
                      <td className={`p-4 text-right font-bold ${dif === 0 ? 'text-slate-400 dark:text-zinc-600 font-normal' : dif > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {dif === 0 ? 'S/ 0.00' : `${dif > 0 ? '+' : ''} S/ ${dif.toFixed(2)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* RESUMEN DERECHO: DICTAMEN DE CAJA */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#121016]/20 p-6 border border-slate-100 dark:border-purple-950/30 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-4 flex gap-2 font-bold text-slate-700 dark:text-zinc-300">
                  <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400" /> Dictamen de Cuadre
                </h4>
                
                <div className="space-y-3 text-sm border-b border-slate-100 dark:border-purple-950/20 pb-4">
                  <div className="flex justify-between text-slate-500 dark:text-zinc-400 font-medium">
                    <span>Esperado total in caja:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">S/ {saldoCajaEsperado.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 italic">
                    *(Suma ingresos + base inicial - egresos)
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold mb-1">Diferencia Neta Global</p>
                <div className={`p-4 rounded-xl text-center text-xl font-bold border ${
                  diferenciaTotalGlobal === 0 
                    ? 'bg-slate-100 dark:bg-zinc-800/20 text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800/40' 
                    : diferenciaTotalGlobal > 0 
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                }`}>
                  S/ {diferenciaTotalGlobal.toFixed(2)}
                </div>

                {diferenciaTotalGlobal !== 0 && (
                  <div className="text-purple-600 dark:text-purple-400 text-xs mt-3 flex gap-2 items-center justify-center border border-purple-500/20 p-2.5 bg-purple-500/5 rounded-lg">
                    <AlertCircle size={14} className="shrink-0" />
                    <span className="font-medium">Se registrará un descuadre en el historial.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CierreCaja;