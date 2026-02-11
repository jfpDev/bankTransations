/**
 * @typedef {Object} Transaction
 * @property {number} [id] - ID de la transacción
 * @property {number} amount - Monto de la transacción en pesos
 * @property {string} businessCategory - Giro o comercio de la transacción
 * @property {string} tenpistaName - Nombre del Tenpista
 * @property {string} transactionDate - Fecha de la transacción (ISO string)
 * @property {string} [createdAt] - Fecha de creación
 * @property {string} [updatedAt] - Fecha de última actualización
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {number} status - Código de estado HTTP
 * @property {string} error - Tipo de error
 * @property {string} message - Mensaje de error
 * @property {string[]} [details] - Detalles adicionales del error
 * @property {string} timestamp - Timestamp del error
 * @property {string} path - Path donde ocurrió el error
 */

export const TransactionTypes = {};