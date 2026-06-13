import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { User, Scissors, Package } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';

// Importación de sub-componentes
import HeaderActions from '../components/venta/HeaderActions';
import MenuLateral from '../components/venta/MenuLateral';
import ClientesPanel from '../components/venta/ClientesPanel';
import ServiciosPanel from '../components/venta/ServiciosPanel';
import ProductosPanel from '../components/venta/ProductosPanel';
import DetalleVenta from '../components/venta/DetallesVenta';
import PagoDrawer from '../components/venta/PagoDrawer';
import { BoletaPDF } from '../components/venta/pdf/pdf';

// MOCKS
const MOCK_SERVICIOS = [
  { id: 's1', nombre: 'Corte de Cabello Premium', precio: 45.00, tiempo: '30 min' },
  { id: 's2', nombre: 'Tinte & Coloración Global', precio: 120.00, tiempo: '90 min' },
  { id: 's3', nombre: 'Tratamiento de Hidratación', precio: 75.00, tiempo: '45 min' },
  { id: 's4', nombre: 'Manicure Express', precio: 30.00, tiempo: '20 min' },
];

const MOCK_PRODUCTOS = [
  { id: 'p1', nombre: 'Shampoo Matizador Gold', precio: 65.00, stock: 12 },
  { id: 'p2', nombre: 'Cera Modeladora Mate', precio: 40.00, stock: 8 },
  { id: 'p3', nombre: 'Óleo de Argán Reparador', precio: 95.00, stock: 5 },
];

const MOCK_CLIENTES = [
  { id: 'c1', nombre: 'Valeria Mendoza', telefono: '987 654 321', email: 'valeria@mail.com' },
  { id: 'c2', nombre: 'Carlos Torres', telefono: '912 345 678', email: 'carlos@mail.com' },
];

export default function Venta() {
  const [ventas, setVentas] = useState([{ id: 1, nombre: 'Venta 1', cliente: null, items: [], total: 0 }]);
  const [ventaActivaId, setVentaActivaId] = useState(1);
  const [menuActivo, setMenuActivo] = useState('cliente'); 
  const [showPago, setShowPago] = useState(false); 
  const [metodoPago, setMetodoPago] = useState('efectivo');

  const ventaActual = ventas.find(v => v.id === ventaActivaId) || ventas[0];

  const menuOpciones = [
    { id: 'cliente', icon: User, label: 'Clientes' },
    { id: 'servicios', icon: Scissors, label: 'Servicios' },
    { id: 'productos', icon: Package, label: 'Productos' }
  ];

  const handleNuevaVenta = () => {
    const nuevaId = Date.now();
    setVentas([...ventas, { id: nuevaId, nombre: `Venta ${ventas.length + 1}`, cliente: null, items: [], total: 0 }]);
    setVentaActivaId(nuevaId);
  };

  const handleDuplicarVenta = () => {
    const nuevaId = Date.now();
    setVentas([...ventas, { ...ventaActual, id: nuevaId, nombre: `${ventaActual.nombre} (Copia)` }]);
    setVentaActivaId(nuevaId);
  };

const finalizarYDescargarPago = async (detallesPago) => {
    try {
      const dataPDF = {
        fecha: new Date().toLocaleDateString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        
        // 1. Corregimos para que use el método real seleccionado en el Drawer
        metodoPago: detallesPago?.metodo || 'efectivo', 
        
        nombreCliente: ventaActual.cliente ? ventaActual.cliente.nombre : 'Cliente General',
        items: ventaActual.items.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad
        })),
        subtotal: ventaActual.total * 0.82,
        descuento: detallesPago?.descuento || 0,
        comision: detallesPago?.comision || 0,
        
        // 2. PASAMOS EL MONTO RECIBIDO AL PDF (viene desde el PagoDrawer)
        montoRecibido: detallesPago?.montoRecibido || 0, 

        // Nota: Si el pago es con tarjeta o mixto, ajustamos el totalFinal 
        // sumándole la comisión cobrada si es que tu PDF debe reflejar el neto + comisión.
        totalFinal: ventaActual.total + (detallesPago?.comision || 0)
      };

      const doc = <BoletaPDF data={dataPDF} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `boleta-${ventaActual.nombre.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      removerVentaDeLista(ventaActivaId);
      setShowPago(false);
    } catch (error) {
      console.error("Error generando el comprobante de pago:", error);
    }
  };
  const cancelarVentaActual = () => {
    removerVentaDeLista(ventaActivaId);
    setShowPago(false);
  };

  const removerVentaDeLista = (idAEliminar) => {
    const listasFiltradas = ventas.filter(v => v.id !== idAEliminar);
    
    if (listasFiltradas.length === 0) {
      const nuevaId = Date.now();
      setVentas([{ id: nuevaId, nombre: 'Venta 1', cliente: null, items: [], total: 0 }]);
      setVentaActivaId(nuevaId);
    } else {
      setVentas(listasFiltradas);
      setVentaActivaId(listasFiltradas[0].id);
    }
  };

  const agregarAlCarrito = (item, tipo) => {
    const nuevasVentas = ventas.map(v => {
      if (v.id === ventaActivaId) {
        const existente = v.items.find(i => i.id === item.id);
        let nuevosItems = existente 
          ? v.items.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i)
          : [...v.items, { ...item, cantidad: 1, tipo }];
        return { ...v, items: nuevosItems, total: nuevosItems.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0) };
      }
      return v;
    });
    setVentas(nuevasVentas);
  };

  const actualizarCantidad = (itemId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(itemId);
      return;
    }
    const nuevasVentas = ventas.map(v => {
      if (v.id === ventaActivaId) {
        const nuevosItems = v.items.map(i => i.id === itemId ? { ...i, cantidad: nuevaCantidad } : i);
        return { ...v, items: nuevosItems, total: nuevosItems.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0) };
      }
      return v;
    });
    setVentas(nuevasVentas);
  };

  const eliminarDelCarrito = (itemId) => {
    const nuevasVentas = ventas.map(v => {
      if (v.id === ventaActivaId) {
        const nuevosItems = v.items.filter(i => i.id !== itemId);
        return { ...v, items: nuevosItems, total: nuevosItems.reduce((acc, curr) => acc + (curr.precio * curr.cantidad), 0) };
      }
      return v;
    });
    setVentas(nuevasVentas);
  };

  const seleccionarCliente = (cliente) => {
    setVentas(ventas.map(v => v.id === ventaActivaId ? { ...v, cliente } : v));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#121016] overflow-hidden text-slate-900 dark:text-zinc-100 antialiased font-sans">
      
      <HeaderActions 
        ventas={ventas} 
        ventaActivaId={ventaActivaId} 
        setVentaActivaId={setVentaActivaId} 
        onNueva={handleNuevaVenta} 
        onDuplicar={handleDuplicarVenta} 
      />

      <div className="flex flex-1 overflow-hidden relative">
        <MenuLateral 
          menuActivo={menuActivo} 
          setMenuActivo={setMenuActivo} 
          opciones={menuOpciones} 
        />

        {menuActivo && (
          <div className="w-[40%] max-w-md h-full bg-white dark:bg-[#121016] border-r border-slate-200 dark:border-purple-950/40 flex flex-col overflow-hidden z-20">
            <AnimatePresence mode="wait">
              {menuActivo === 'cliente' && (
                <ClientesPanel 
                  ventaActual={ventaActual} 
                  seleccionarCliente={seleccionarCliente} 
                  mockClientes={MOCK_CLIENTES} 
                />
              )}
              {menuActivo === 'servicios' && (
                <ServiciosPanel 
                  agregarAlCarrito={agregarAlCarrito} 
                  ventaActual={ventaActual}
                  mockServicios={MOCK_SERVICIOS} 
                />
              )}
              {menuActivo === 'productos' && (
                <ProductosPanel 
                  agregarAlCarrito={agregarAlCarrito} 
                  ventaActual={ventaActual}
                  mockProductos={MOCK_PRODUCTOS} 
                />
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="flex-1 h-full bg-slate-50 dark:bg-[#121016]/60 flex relative overflow-hidden">
          <DetalleVenta 
            ventaActual={ventaActual} 
            eliminarDelCarrito={eliminarDelCarrito} 
            actualizarCantidad={actualizarCantidad}
            setShowPago={setShowPago} 
          />

          <AnimatePresence>
            {showPago && (
              <PagoDrawer 
                showPago={showPago} 
                setShowPago={setShowPago} 
                total={ventaActual.total} 
                metodoPago={metodoPago} 
                setMetodoPago={setMetodoPago}
                onConfirmarPago={finalizarYDescargarPago}
                onCancelarVenta={cancelarVentaActual}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}