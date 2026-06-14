/**
 * ============================================================================
 * UTILIDADES GLOBALES - Sistema de Gestión
 * ============================================================================
 * Funciones reutilizables y seguras para manejo de datos, fechas y formatos
 * Preparadas para producción con validación de casos borde
 * ============================================================================
 */

export const formatFechaLocal = (dateInput, options = {}) => {
  const {
    locale = 'es-PE',
    includeTime = true,
    fallback = '-'
  } = options;

  if (!dateInput || dateInput === '') return fallback;

  try {
    let fechaObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(fechaObj.getTime())) {
      console.warn(`Fecha inválida recibida: ${dateInput}`);
      return fallback;
    }
    const formatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };

    return fechaObj.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.error('Error al formatear fecha:', error, dateInput);
    return fallback;
  }
};

export const toLocalDateString = (dateInput) => {
  if (!dateInput || dateInput === '') return null;

  try {
    const fechaObj = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(fechaObj.getTime())) return null;
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error al convertir fecha a string local:', error);
    return null;
  }
};
export const estaEnRangoFechas = (fecha, fechaInicio, fechaFin) => {
  if (!fecha) return false;

  try {
    const fechaLocal = toLocalDateString(fecha);
    if (!fechaLocal) return false;
    if (fechaInicio && fechaLocal < fechaInicio) return false;
    if (fechaFin && fechaLocal > fechaFin) return false;

    return true;
  } catch (error) {
    console.error('Error en comparación de rangos:', error);
    return false;
  }
};
export const getFechaHoyLocal = () => {
  return toLocalDateString(new Date());
};

// ============================================================================
// MANEJO SEGURO DE NÚMEROS Y MONEDA
// ============================================================================

export const toNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const formatMoneda = (value, options = {}) => {
  const {
    locale = 'es-PE',
    currency = 'PEN',
    decimals = 2,
    prefix = 'S/ ',
    showPrefix = true
  } = options;

  const numValue = toNumber(value, 0);

  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(numValue);

    return showPrefix ? formatted : formatted.replace(/[^\d.,]/g, '');
  } catch (error) {
    console.error('Error al formatear moneda:', error);
    return `${prefix}${numValue.toFixed(decimals)}`;
  }
};

export const calcularPorcentaje = (parte, total, decimals = 2) => {
  const numParte = toNumber(parte, 0);
  const numTotal = toNumber(total, 0);

  if (numTotal === 0) return 0;

  const porcentaje = (numParte / numTotal) * 100;
  return Number(porcentaje.toFixed(decimals));
};

export const calcularGanancia = (precio, costo) => {
  const numPrecio = toNumber(precio, 0);
  const numCosto = toNumber(costo, 0);

  const ganancia = numPrecio - numCosto;
  const margen = numCosto > 0 ? ((ganancia / numCosto) * 100) : 0;

  return {
    ganancia: Number(ganancia.toFixed(2)),
    margen: Number(margen.toFixed(2))
  };
};

// ============================================================================
// VALIDACIÓN Y SANITIZACIÓN DE STRINGS
// ============================================================================

export const sanitizeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  
  const str = String(value).trim();
  return str === '' ? defaultValue : str;
};

export const contieneTexto = (value, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return true;
  if (value === null || value === undefined) return false;

  const valorLimpio = sanitizeString(value).toLowerCase();
  const busquedaLimpia = searchTerm.trim().toLowerCase();

  return valorLimpio.includes(busquedaLimpia);
};

export const estaEnRangoNumerico = (value, range) => {
  if (!range || range === '') return true;

  const numValue = toNumber(value, 0);

  try {
    if (range.includes('+')) {
      const min = toNumber(range.replace('+', ''), 0);
      return numValue > min;
    }

    const [min, max] = range.split('-').map(v => toNumber(v, 0));
    
    if (max === undefined) {
      return numValue === min;
    }

    return numValue >= min && numValue <= max;
  } catch (error) {
    console.error('Error al validar rango numérico:', error);
    return true;
  }
};

// ============================================================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ============================================================================

export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;

  try {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

export const ordenarPor = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return [];

  return [...array].sort((a, b) => {
    const valA = getNestedValue(a, key, '');
    const valB = getNestedValue(b, key, '');

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================================================
// VALIDACIONES ESPECÍFICAS DEL NEGOCIO
// ============================================================================

export const validarEstado = (estado, filtroEstado) => {
  if (!filtroEstado || filtroEstado === '') return true;

  const estadoBooleano = Boolean(estado);
  const filtroBooleano = filtroEstado === 'true';

  return estadoBooleano === filtroBooleano;
};

export const generarCodigoTemporal = (prefix = 'TEMP') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

// ============================================================================
// EXPORT DEFAULT (opcional, para importar todo junto)
// ============================================================================

export default {
  // Fechas
  formatFechaLocal,
  toLocalDateString,
  estaEnRangoFechas,
  getFechaHoyLocal,
  
  // Números y Moneda
  toNumber,
  formatMoneda,
  calcularPorcentaje,
  calcularGanancia,
  
  // Strings
  sanitizeString,
  contieneTexto,
  estaEnRangoNumerico,
  
  // Objetos y Arrays
  getNestedValue,
  ordenarPor,
  
  // Validaciones
  validarEstado,
  generarCodigoTemporal
};
