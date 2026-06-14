import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  DollarSign, 
  Smartphone, 
  CreditCard, 
  Layers, 
  X, 
  AlertCircle, 
  Check,
  ShieldCheck,
  Trash2
} from 'lucide-react';

const METODOS_LISTA = ['efectivo', 'yape', 'plin', 'tarjeta'];

export default function PagoDrawer({ 
  showPago, 
  setShowPago, 
  total,
  onConfirmarPago,
  onCancelarVenta 
}) {
  const [metodo, setMetodo] = useState('efectivo');
  const [montoPagoSimple, setMontoPagoSimple] = useState('');
  const [pagosMixtos, setPagosMixtos] = useState([{ tipo: 'efectivo', monto: '' }]);

  if (!showPago) return null;

  const totalConComisionSimple = useMemo(() => {
    return metodo === 'tarjeta' ? total * 1.05 : total;
  }, [metodo, total]);

  const cambioSimple = useMemo(() => {
    const recibido = Number(montoPagoSimple || 0);
    return recibido - totalConComisionSimple;
  }, [montoPagoSimple, totalConComisionSimple]);

  const abonoRealSimple = useMemo(() => {
    const recibido = Number(montoPagoSimple || 0);
    if (recibido === 0) return 0;
    return metodo === 'tarjeta' ? total : recibido;
  }, [montoPagoSimple, metodo, total]);

  const resumenMixto = useMemo(() => {
    let abonoRealTotal = 0;
    let totalCobradoConComisiones = 0;
    let totalComisionesAcumuladas = 0;

    const detalle = pagosMixtos.map(pago => {
      const montoIngresado = Number(pago.monto || 0);
      let abonoNeto = montoIngresado;
      let comisionItem = 0;

      if (pago.tipo === 'tarjeta') {
        abonoNeto = montoIngresado / 1.05;
        comisionItem = montoIngresado - abonoNeto;
      }

      abonoRealTotal += abonoNeto;
      totalCobradoConComisiones += montoIngresado;
      totalComisionesAcumuladas += comisionItem;

      return {
        ...pago,
        abonoReal: abonoNeto,
        comision: comisionItem
      };
    });

    const faltanteReal = total - abonoRealTotal;
    const vueltoReal = abonoRealTotal > total ? abonoRealTotal - total : 0;

    return {
      detalle,
      abonoRealTotal,
      totalCobradoConComisiones,
      totalComisionesAcumuladas,
      faltanteReal,
      vueltoReal
    };
  }, [pagosMixtos, total]);

  const metodosYaUtilizados = pagosMixtos.map(p => p.tipo);

  const actualizarPagoMixto = (index, campo, valor) => {
    const copia = [...pagosMixtos];
    copia[index][campo] = valor;
    setPagosMixtos(copia);
  };

  const agregarMetodoMixto = () => {
    const disponibles = METODOS_LISTA.filter(m => !metodosYaUtilizados.includes(m));
    if (disponibles.length === 0) return;
    setPagosMixtos([...pagosMixtos, { tipo: disponibles[0], monto: '' }]);
  };

  const eliminarMetodoMixto = (index) => {
    setPagosMixtos(pagosMixtos.filter((_, i) => i !== index));
  };

  const resetearModuloPago = () => {
    setMetodo('efectivo');
    setMontoPagoSimple('');
    setPagosMixtos([{ tipo: 'efectivo', monto: '' }]);
  };

  const handleConfirmar = () => {
    if (metodo !== 'mixto') {
      const esTarjeta = metodo === 'tarjeta';
      onConfirmarPago({
        metodo,
        descuento: 0,
        comision: esTarjeta ? total * 0.05 : 0,
        montoRecibido: Number(montoPagoSimple || 0),
        esMixto: false
      });
    } else {
      onConfirmarPago({
        metodo: 'mixto',
        descuento: 0,
        comision: resumenMixto.totalComisionesAcumuladas,
        detalleMixto: resumenMixto.detalle,
        esMixto: true
      });
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
        onClick={() => { resetearModuloPago(); setShowPago(false); }}
        className="absolute inset-0 bg-black/40 z-40"
      />

      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 bottom-0 w-[26rem] bg-white dark:bg-[#121016] border-l border-slate-200 dark:border-purple-950/40 shadow-2xl z-50 flex flex-col p-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-purple-950/30 mb-6 flex-shrink-0">
          <button 
            type="button"
            onClick={() => { resetearModuloPago(); setShowPago(false); }} 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} /> Volver al detalle
          </button>
          <span className="font-bold text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">Procesar Pago</span>
        </div>

        <div className="flex flex-col items-center mb-6 bg-purple-600/5 dark:bg-purple-400/5 border border-purple-600/10 dark:border-purple-400/10 rounded-2xl py-5 w-full flex-shrink-0">
          <span className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Monto de la Venta</span>
          <h1 className="text-4xl font-black text-purple-600 dark:text-purple-400">
            S/ {metodo === 'mixto' ? total.toFixed(2) : totalConComisionSimple.toFixed(2)}
          </h1>
          {metodo === 'tarjeta' && (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded mt-1 font-bold border border-indigo-500/20">
              Incluye Comisión +5%
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2.5 mb-4 flex-shrink-0">
          <span className="font-bold text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">Método de Pago</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'efectivo', label: 'Efectivo', icon: DollarSign, activeClass: 'bg-purple-600 text-white dark:bg-purple-500 dark:text-zinc-950 border-transparent font-bold' },
              { id: 'yape', label: 'Yape', icon: Smartphone, activeClass: 'bg-[#742484] text-white border-transparent font-bold' },
              { id: 'plin', label: 'Plin', icon: Smartphone, activeClass: 'bg-[#00bda5] text-white border-transparent font-bold' },
              { id: 'tarjeta', label: 'Tarjeta (+5%)', icon: CreditCard, activeClass: 'bg-indigo-600 text-white border-transparent font-bold' },
            ].map(m => {
              const Icon = m.icon;
              const activo = metodo === m.id;
              return (
                <button 
                  key={m.id} 
                  type="button"
                  onClick={() => setMetodo(m.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${activo ? m.activeClass + ' shadow-md scale-[1.02]' : 'bg-slate-50 dark:bg-[#121016]/40 border-slate-200 dark:border-purple-950/40 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-purple-950/30'}`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setMetodo('mixto')}
          className={`w-full py-3 rounded-xl mb-5 border transition-all flex-shrink-0 ${metodo === 'mixto' ? 'border-purple-600 bg-purple-600/10 text-purple-600 dark:border-purple-400 dark:bg-purple-400/10 dark:text-purple-400 font-bold shadow-sm' : 'border-slate-200 dark:border-purple-950/40 bg-slate-50 dark:bg-[#121016]/40 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-purple-950/30 font-semibold'}`}
        >
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
            <Layers size={15} /> <span>Habilitar Pago Mixto</span>
          </div>
        </button>
        <div className="mb-6 flex-shrink-0">
          {metodo !== 'mixto' ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500">Monto Recibido</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-slate-400 dark:text-zinc-500">S/</span>
                  <input 
                    type="number" 
                    value={montoPagoSimple}
                    onChange={(e) => setMontoPagoSimple(e.target.value)}
                    placeholder="0.00" 
                    step="0.01"
                    className="w-full text-right pr-4 pl-10 text-xl font-mono font-bold bg-slate-50 dark:bg-[#121016]/40 border border-slate-200 dark:border-purple-950/50 rounded-xl p-3 outline-none focus:border-purple-600 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-600 dark:focus:ring-purple-400 transition-all text-slate-800 dark:text-zinc-100"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 bg-slate-50 dark:bg-[#121016]/40 border border-slate-100 dark:border-purple-950/30 rounded-xl p-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-zinc-500 font-medium block mb-0.5">Abono Neto Real:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">S/ {abonoRealSimple.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 dark:text-zinc-500 font-medium block mb-0.5">{cambioSimple >= 0 ? 'Vuelto:' : 'Faltante:'}</span>
                  <span className={`font-bold text-sm ${cambioSimple >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    S/ {Math.abs(cambioSimple).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="font-bold text-xs tracking-wider uppercase text-slate-400 dark:text-zinc-500 block">Distribución de Canales</span>
              
              <div className="flex flex-col gap-3">
                {resumenMixto.detalle.map((pago, index) => (
                  <div key={index} className="rounded-xl p-3.5 bg-slate-50 dark:bg-[#121016]/40 border border-slate-200/50 dark:border-purple-950/30 relative flex flex-col gap-2.5">
                    <div className="flex gap-2 items-center">
                      <select 
                        value={pago.tipo} 
                        onChange={(e) => actualizarPagoMixto(index, 'tipo', e.target.value)} 
                        className="p-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/50 outline-none text-slate-700 dark:text-zinc-300 focus:border-purple-600 dark:focus:border-purple-400"
                      >
                        {METODOS_LISTA.filter(m => !metodosYaUtilizados.includes(m) || m === pago.tipo).map(m => (
                          <option key={m} value={m} className="capitalize bg-white dark:bg-[#121016]">{m === 'tarjeta' ? 'Tarjeta (+5%)' : m}</option>
                        ))}
                      </select>
                      
                      <input 
                        type="number" 
                        placeholder="Monto S/" 
                        value={pago.monto} 
                        onChange={(e) => actualizarPagoMixto(index, 'monto', e.target.value)} 
                        className="flex-1 p-2 text-xs font-bold rounded-lg bg-white dark:bg-[#121016] border border-slate-200 dark:border-purple-950/50 outline-none text-right placeholder-slate-400 focus:border-purple-600 dark:focus:border-purple-400 transition-colors"
                      />
                      
                      {pagosMixtos.length > 1 && (
                        <button type="button" onClick={() => eliminarMetodoMixto(index)} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                          <X size={16}/>
                        </button>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[11px] px-1 text-slate-400 dark:text-zinc-500 font-medium">
                      <div className="flex gap-1">
                        <span>Neto Real:</span>
                        <span className="text-emerald-500 font-bold">S/ {pago.abonoReal.toFixed(2)}</span>
                      </div>
                      {pago.tipo === 'tarjeta' && (
                        <div className="flex gap-1">
                          <span>Comisión cobrada:</span>
                          <span className="text-rose-400 font-bold">S/ {pago.comision.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pagosMixtos.length < METODOS_LISTA.length && (
                <button 
                  type="button"
                  onClick={agregarMetodoMixto} 
                  className="w-full py-2 rounded-xl border border-dashed border-slate-300 dark:border-purple-950/60 text-slate-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 hover:border-purple-600/50 dark:hover:border-purple-400/50 transition-colors text-xs font-medium"
                >
                  + Agregar otro método de pago
                </button>
              )}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#121016]/40 border border-slate-200 dark:border-purple-950/30 text-xs flex flex-col gap-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400 dark:text-zinc-500">Deuda Cubierta Real:</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">
                    S/ {resumenMixto.abonoRealTotal.toFixed(2)} / S/ {total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400 dark:text-zinc-500">Total en Caja (Con Comisiones):</span>
                  <span className="font-bold text-slate-800 dark:text-zinc-200">S/ {resumenMixto.totalCobradoConComisiones.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400 dark:text-zinc-500">Comisiones Totales (+5%):</span>
                  <span className="text-rose-400 font-bold">S/ {resumenMixto.totalComisionesAcumuladas.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-purple-950/30 mt-1">
                  {resumenMixto.faltanteReal > 0.01 ? (
                    <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-600/5 dark:bg-purple-400/5 p-2 rounded-lg border border-purple-600/10 dark:border-purple-400/10">
                      <AlertCircle size={14}/>
                      <p className="font-medium text-[11px]">Faltan cubrir: <b>S/ {resumenMixto.faltanteReal.toFixed(2)}</b> neto</p>
                    </div>
                  ) : (
                    <div className="text-emerald-500 font-bold flex items-center justify-center gap-1.5 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-[11px]">
                      <Check size={14}/> Balance cubierto completamente
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-purple-950/30 bg-slate-50/50 dark:bg-purple-950/10 rounded-xl flex flex-col gap-2.5 mt-auto flex-shrink-0">
          <button 
            type="button"
            onClick={handleConfirmar}
            disabled={
              (metodo === 'mixto' && resumenMixto.faltanteReal > 0.01) || 
              (metodo !== 'mixto' && (montoPagoSimple === '' || cambioSimple < 0))
            }
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-purple-950/40 dark:disabled:to-purple-950/40 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white font-black text-xs shadow-md hover:opacity-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ShieldCheck size={15} />
            <span>Finalizar y Cobrar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if(window.confirm('¿Estás seguro de que deseas cancelar y eliminar esta venta por completo?')) {
                onCancelarVenta();
              }
            }}
            className="w-full py-2.5 border border-rose-200/60 dark:border-rose-950/40 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Trash2 size={13} />
            <span>Cancelar y eliminar orden</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}