import { initialData } from "../components/TransactionForm";
import { Transaction } from "../types";

/**
 * Formatea un número como moneda en pesos chilenos
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatea una fecha para mostrar
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Formatea una fecha para input datetime-local
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha en formato yyyy-MM-ddTHH:mm
 */
export const formatDateForInput = (date: string | Date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Valida los datos de una transacción
 * @param {Object} transaction - Datos de la transacción
 * @returns {Object} Objeto con isValid y errors
 */
type ErrorsType = {
  amount: string;
  businessName: string;
  name: string;
  transactionDate: string;
}
export const validateTransaction = (transaction: Transaction) => {
  const errors: ErrorsType = {
    amount: '',
    businessName: '',
    name: '',
    transactionDate: '',
  
  };

  // Validar monto
  if (!transaction.amount && transaction.amount !== 0) {
    errors.amount = 'El monto es obligatorio';
  } else if (transaction.amount < 0) {
    errors.amount = 'El monto no puede ser negativo';
  } else if (!Number.isInteger(Number(transaction.amount))) {
    errors.amount = 'El monto debe ser un número entero';
  }

  // Validar giro/comercio
  if (!transaction.businessName || transaction.businessName.trim() === '') {
    errors.businessName = 'El giro o comercio es obligatorio';
  } else if (transaction.businessName.length > 255) {
    errors.businessName = 'El giro no puede exceder 255 caracteres';
  }

  // Validar nombre de Tenpista
  if (!transaction.name || transaction.name.trim() === '') {
    errors.name = 'El nombre del usuario es obligatorio';
  } else if (transaction.name.length > 255) {
    errors.name = 'El nombre no puede exceder 255 caracteres';
  }

  // Validar fecha
  if (!transaction.transactionDate) {
    errors.transactionDate = 'La fecha de transacción es obligatoria';
  } else {
    const transactionDate = new Date(transaction.transactionDate);
    const now = new Date();
    if (transactionDate > now) {
      errors.transactionDate = 'La fecha de transacción no puede ser futura';
    }
  }

  return {
    isValid: errors.amount === '' && errors.businessName === '' && errors.name === '' && errors.transactionDate === '',
    errors,
  };
};

/**
 * Trunca un texto si excede una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text: string, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Obtiene la fecha y hora actual en formato para input
 * @returns {string} Fecha actual en formato yyyy-MM-ddTHH:mm
 */
export const getCurrentDateTime = () => {
  return formatDateForInput(new Date());
};

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export const debounce = (func: (...args: any[]) => any, wait = 300) => {
  let timeout: any;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};