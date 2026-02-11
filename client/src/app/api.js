import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar X-Client-Id (para rate limiting)
apiClient.interceptors.request.use(
  (config) => {
    // Generar o recuperar un ID de cliente único
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
      clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('clientId', clientId);
    }
    config.headers['X-Client-Id'] = clientId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const errorData = error.response.data;
      
      // Formatear mensaje de error
      let errorMessage = errorData.message || 'Ha ocurrido un error';
      
      if (errorData.details && errorData.details.length > 0) {
        errorMessage += ': ' + errorData.details.join(', ');
      }
      
      return Promise.reject({
        status: error.response.status,
        message: errorMessage,
        data: errorData,
      });
    } else if (error.request) {
      // La solicitud se realizó pero no se recibió respuesta
      return Promise.reject({
        status: 0,
        message: 'No se pudo conectar con el servidor',
      });
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject({
        status: 0,
        message: error.message || 'Error desconocido',
      });
    }
  }
);

/**
 * Servicio para operaciones CRUD de transacciones
 */
export const transactionService = {
  /**
   * Obtiene todas las transacciones
   * @returns {Promise<Transaction[]>}
   */
  getAll: async () => {
    const response = await apiClient.get('/transaction');
    return response.data;
  },

  /**
   * Obtiene una transacción por ID
   * @param {number} id - ID de la transacción
   * @returns {Promise<Transaction>}
   */
  getById: async (id) => {
    const response = await apiClient.get(`/transaction/${id}`);
    return response.data;
  },

  /**
   * Obtiene transacciones por nombre de Tenpista
   * @param {string} tenpistaName - Nombre del Tenpista
   * @returns {Promise<Transaction[]>}
   */
  getByTenpista: async (tenpistaName) => {
    const response = await apiClient.get(`/transaction/tenpista/${tenpistaName}`);
    return response.data;
  },

  /**
   * Crea una nueva transacción
   * @param {Transaction} transaction - Datos de la transacción
   * @returns {Promise<Transaction>}
   */
  create: async (transaction) => {
    const response = await apiClient.post('/transaction', transaction);
    return response.data;
  },

  /**
   * Actualiza una transacción existente
   * @param {number} id - ID de la transacción
   * @param {Transaction} transaction - Datos actualizados
   * @returns {Promise<Transaction>}
   */
  update: async (id, transaction) => {
    const response = await apiClient.put(`/transaction/${id}`, transaction);
    return response.data;
  },

  /**
   * Elimina una transacción
   * @param {number} id - ID de la transacción
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    await apiClient.delete(`/transaction/${id}`);
  },
};

export default apiClient;