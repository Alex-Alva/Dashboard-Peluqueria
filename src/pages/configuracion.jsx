/**
 * ============================================================================
 * PÁGINA DE CONFIGURACIÓN - Personalización del Sistema
 * ============================================================================
 * Permite personalizar la apariencia visual del sistema incluyendo:
 * - Paleta de colores (fondos, botones, acentos)
 * - Tipografía (tamaño y tipo de fuente)
 * - Identidad de marca (nombre y logo)
 * - Orden del menú lateral
 * 
 * Estado: Simulación (cambios no persistidos en BD)
 * ============================================================================
 */

import { useState } from 'react';
import { Save, RotateCcw, Sparkles } from 'lucide-react';

// Subcomponentes especializados por funcionalidad
import PaletaColores from '../components/configuracion/PaletaColores';
import Tipografia from '../components/configuracion/Tipografia';
import IdentidadMarca from '../components/configuracion/IdentidadMarca';
import GestionSidebar from '../components/configuracion/GestionSidebar';
import VistaPrevia from '../components/configuracion/VistaPrevia';

export default function Configuracion() {
  // ============================================================================
  // ESTADO: Configuración de Apariencia Visual
  // ============================================================================
  const [colorFondo, setColorFondo] = useState('#121016');       // Color del fondo principal
  const [colorBoton, setColorBoton] = useState('purple-indigo'); // Estilo de gradiente para botones
  const [colorAcento, setColorAcento] = useState('purple');      // Color de resaltado y énfasis
  const [tamanoTexto, setTamanoTexto] = useState('mediano');     // Tamaño de fuente global
  const [tipoFuente, setTipoFuente] = useState('sans');          // Familia tipográfica

  // ============================================================================
  // ESTADO: Identidad y Branding
  // ============================================================================
  const [nombreSistema, setNombreSistema] = useState('Sistema Peluquería');
  const [logoUrl, setLogoUrl] = useState(null); // Base64 de imagen cargada

  // ============================================================================
  // ESTADO: Estructura del Menú Lateral
  // ============================================================================
  const [menuItems, setMenuItems] = useState([
    { id: 1, nombre: 'Dashboard', icono: '📊' },
    { id: 2, nombre: 'Clientes', icono: '👥' },
    { id: 3, nombre: 'Servicios', icono: '✂️' },
    { id: 4, nombre: 'Productos', icono: '🛍️' },
    { id: 5, nombre: 'Citas', icono: '📅' },
    { id: 6, nombre: 'Finanzas', icono: '💰' },
  ]);

  // ============================================================================
  // HANDLERS: Reordenamiento del Menú
  // ============================================================================
  
  /** Intercambia item con el anterior (mueve hacia arriba) */
  const moverItemArriba = (index) => {
    if (index === 0) return; // Ya está en la cima
    const newItems = [...menuItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setMenuItems(newItems);
  };

  /** Intercambia item con el siguiente (mueve hacia abajo) */
  const moverItemAbajo = (index) => {
    if (index === menuItems.length - 1) return; // Ya está al final
    const newItems = [...menuItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setMenuItems(newItems);
  };

  // ============================================================================
  // HANDLERS: Gestión de Archivos
  // ============================================================================
  
  /** Lee archivo de imagen y lo convierte a Base64 para preview */
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ============================================================================
  // HANDLERS: Reset de Configuración
  // ============================================================================
  
  /** Restaura todos los estados a sus valores iniciales por defecto */
  const resetearConfiguracion = () => {
    setColorFondo('#121016');
    setColorBoton('purple-indigo');
    setColorAcento('purple');
    setTamanoTexto('mediano');
    setTipoFuente('sans');
    setNombreSistema('Sistema Peluquería');
    setLogoUrl(null);
    setMenuItems([
      { id: 1, nombre: 'Dashboard', icono: '📊' },
      { id: 2, nombre: 'Clientes', icono: '👥' },
      { id: 3, nombre: 'Servicios', icono: '✂️' },
      { id: 4, nombre: 'Productos', icono: '🛍️' },
      { id: 5, nombre: 'Citas', icono: '📅' },
      { id: 6, nombre: 'Finanzas', icono: '💰' },
    ]);
  };

  // ============================================================================
  // RENDERIZADO
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent p-6">
      
      {/* Cabecera de página con breadcrumb y título */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-purple-400/50 font-mono mb-2">
          Panel de Control / Configuración
        </p>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Personalización del Sistema
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-purple-300/70">
          Ajusta la apariencia y comportamiento de tu sistema según tus preferencias
        </p>
      </div>

      {/* Layout principal: 2 columnas (Controles | Vista Previa) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna izquierda: Paneles de configuración (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Panel 1: Selección de paleta de colores */}
          <PaletaColores 
            colorFondo={colorFondo}
            setColorFondo={setColorFondo}
            colorBoton={colorBoton}
            setColorBoton={setColorBoton}
            colorAcento={colorAcento}
            setColorAcento={setColorAcento}
          />

          {/* Panel 2: Configuración tipográfica */}
          <Tipografia 
            tamanoTexto={tamanoTexto}
            setTamanoTexto={setTamanoTexto}
            tipoFuente={tipoFuente}
            setTipoFuente={setTipoFuente}
          />

          {/* Panel 3: Branding y personalización corporativa */}
          <IdentidadMarca 
            nombreSistema={nombreSistema}
            setNombreSistema={setNombreSistema}
            logoUrl={logoUrl}
            handleLogoUpload={handleLogoUpload}
          />

          {/* Panel 4: Gestión del orden del menú lateral */}
          <GestionSidebar 
            menuItems={menuItems}
            moverItemArriba={moverItemArriba}
            moverItemAbajo={moverItemAbajo}
          />

          {/* Acciones principales: Guardar y Resetear configuración */}
          <div className="flex gap-4">
            <button
              onClick={() => alert('Configuración guardada (simulación)')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold transition hover:scale-[1.02] shadow-lg shadow-purple-500/20"
            >
              <Save size={20} />
              Guardar Cambios
            </button>
            <button
              onClick={resetearConfiguracion}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-slate-300 dark:border-purple-950/40 text-slate-700 dark:text-purple-300 font-bold hover:bg-slate-100 dark:hover:bg-purple-950/20 transition"
            >
              <RotateCcw size={20} />
              Resetear
            </button>
          </div>
        </div>

        {/* Columna derecha: Vista previa en tiempo real de cambios (1/3) */}
        <div className="lg:col-span-1">
          <VistaPrevia 
            colorFondo={colorFondo}
            colorBoton={colorBoton}
            colorAcento={colorAcento}
            tamanoTexto={tamanoTexto}
            tipoFuente={tipoFuente}
            nombreSistema={nombreSistema}
            logoUrl={logoUrl}
            menuItems={menuItems}
          />
        </div>
      </div>
    </div>
  );
}
