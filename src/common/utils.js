/**
 * ============================================================================
 * UTILIDADES GLOBALES - Sistema de Gestión
 * ============================================================================
 * Funciones reutilizables y seguras para manejo de datos, fechas y formatos
 * Preparadas para producción con validación de casos borde
 * ============================================================================
 */

// ============================================================================
// MANEJO SEGURO DE FECHAS
// ============================================================================

/**
 * Formatea una fecha en formato local (dd/mm/yyyy hh:mm)
 * Maneja null, undefined, strings vacíos y formatos inválidos
 * @param {string|Date|null|undefined} dateInput - Fecha a formatear
 * @param {object} options - Opciones de formato (locale, format)
 * @returns {string} Fecha formateada o '-' si es inválida
 */
export const formatFechaLocal = (dateInput, options = {}) => {
  const {
    locale = 'es-PE',
    includeTime = true,
    fallback = '-'
  } = options;

  // Validación: null, undefined o string vacío
  if (!dateInput || dateInput === '') return fallback;

  try {
    // Si ya es un objeto Date válido
    let fechaObj = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // Validar que la fecha sea válida
    if (isNaN(fechaObj.getTime())) {
      console.warn(`Fecha inválida recibida: ${dateInput}`);
      return fallback;
    }

    // Formatear según opciones
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

/**
 * Convierte una fecha a formato YYYY-MM-DD respetando zona horaria local
 * Evita el bug de desfase por timezone al usar split('T')[0]
 * @param {string|Date|null|undefined} dateInput - Fecha a convertir
 * @returns {string|null} Fecha en formato YYYY-MM-DD o null
 */
export const toLocalDateString = (dateInput) => {
  if (!dateInput || dateInput === '') return null;

  try {
    const fechaObj = dateInput instanceof Date ? dateInput : new Date(dateInput);

    if (isNaN(fechaObj.getTime())) return null;

    // Extraer componentes en zona horaria local (no UTC)
    const year = fechaObj.getFullYear();
    const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const day = String(fechaObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error al convertir fecha a string local:', error);
    return null;
  }
};

/**
 * Compara si una fecha está dentro de un rango (inclusive)
 * Maneja zonas horarias correctamente
 * @param {string|Date} fecha - Fecha a validar
 * @param {string|null} fechaInicio - Inicio del rango (YYYY-MM-DD)
 * @param {string|null} fechaFin - Fin del rango (YYYY-MM-DD)
 * @returns {boolean} true si está en el rango
 */
export const estaEnRangoFechas = (fecha, fechaInicio, fechaFin) => {
  if (!fecha) return false;

  try {
    const fechaLocal = toLocalDateString(fecha);
    if (!fechaLocal) return false;

    // Comparar strings YYYY-MM-DD directamente (más seguro que timestamps)
    if (fechaInicio && fechaLocal < fechaInicio) return false;
    if (fechaFin && fechaLocal > fechaFin) return false;

    return true;
  } catch (error) {
    console.error('Error en comparación de rangos:', error);
    return false;
  }
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD (zona horaria local)
 * @returns {string} Fecha actual
 */
export const getFechaHoyLocal = () => {
  return toLocalDateString(new Date());
};

// ============================================================================
// MANEJO SEGURO DE NÚMEROS Y MONEDA
// ============================================================================

/**
 * Convierte un valor a número de forma segura
 * @param {any} value - Valor a convertir
 * @param {number} defaultValue - Valor por defecto si falla
 * @returns {number} Número parseado o valor por defecto
 */
export const toNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Formatea un número como moneda peruana
 * @param {number|string|null|undefined} value - Valor a formatear
 * @param {object} options - Opciones de formato
 * @returns {string} Valor formateado
 */
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

/**
 * Calcula un porcentaje de forma segura
 * @param {number|string} parte - Parte del total
 * @param {number|string} total - Total
 * @param {number} decimals - Decimales a mostrar
 * @returns {number} Porcentaje calculado
 */
export const calcularPorcentaje = (parte, total, decimals = 2) => {
  const numParte = toNumber(parte, 0);
  const numTotal = toNumber(total, 0);

  if (numTotal === 0) return 0;

  const porcentaje = (numParte / numTotal) * 100;
  return Number(porcentaje.toFixed(decimals));
};

/**
 * Calcula la ganancia y margen de un producto
 * @param {number|string} precio - Precio de venta
 * @param {number|string} costo - Costo del producto
 * @returns {object} {ganancia, margen}
 */
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

/**
 * Valida y limpia un string de forma segura
 * @param {any} value - Valor a limpiar
 * @param {string} defaultValue - Valor por defecto
 * @returns {string} String limpio
 */
export const sanitizeString = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  
  const str = String(value).trim();
  return str === '' ? defaultValue : str;
};

/**
 * Valida si un string contiene un término de búsqueda (case insensitive)
 * @param {any} value - Valor a buscar
 * @param {string} searchTerm - Término de búsqueda
 * @returns {boolean} true si contiene el término
 */
export const contieneTexto = (value, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') return true;
  if (value === null || value === undefined) return false;

  const valorLimpio = sanitizeString(value).toLowerCase();
  const busquedaLimpia = searchTerm.trim().toLowerCase();

  return valorLimpio.includes(busquedaLimpia);
};

/**
 * Valida si un valor está en un rango numérico
 * @param {number|string} value - Valor a validar
 * @param {string} range - Rango en formato "min-max", "max+" o ""
 * @returns {boolean} true si está en el rango
 */
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

/**
 * Obtiene un valor anidado de forma segura de un objeto
 * @param {object} obj - Objeto a consultar
 * @param {string} path - Ruta en formato "prop.subprop.value"
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} Valor encontrado o defaultValue
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  if (!obj || typeof obj !== 'object') return defaultValue;

  try {
    const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la que ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
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

/**
 * Valida el estado de un elemento (activo/inactivo)
 * @param {any} estado - Estado a validar
 * @param {string} filtroEstado - Filtro aplicado ("true", "false", "")
 * @returns {boolean} true si pasa el filtro
 */
export const validarEstado = (estado, filtroEstado) => {
  if (!filtroEstado || filtroEstado === '') return true;

  const estadoBooleano = Boolean(estado);
  const filtroBooleano = filtroEstado === 'true';

  return estadoBooleano === filtroBooleano;
};

/**
 * Genera un código único simple (para uso temporal en simulaciones)
 * @param {string} prefix - Prefijo del código
 * @returns {string} Código generado
 */
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
