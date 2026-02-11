import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/api';

/**
 * Query keys para React Query
 */
export const transactionKeys = {
  all: ['transactions'],
  lists: () => [...transactionKeys.all, 'list'],
  list: (filters) => [...transactionKeys.lists(), { filters }],
  details: () => [...transactionKeys.all, 'detail'],
  detail: (id) => [...transactionKeys.details(), id],
  byTenpista: (name) => [...transactionKeys.all, 'tenpista', name],
};

/**
 * Hook para obtener todas las transacciones
 * @returns {Object} Query result con data, isLoading, error, etc.
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: transactionService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para obtener una transacción por ID
 * @param {number} id - ID de la transacción
 * @returns {Object} Query result
 */
export const useTransaction = (id) => {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener transacciones por Tenpista
 * @param {string} tenpistaName - Nombre del Tenpista
 * @returns {Object} Query result
 */
export const useTransactionsByTenpista = (tenpistaName) => {
  return useQuery({
    queryKey: transactionKeys.byTenpista(tenpistaName),
    queryFn: () => transactionService.getByTenpista(tenpistaName),
    enabled: !!tenpistaName,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para crear una transacción
 * @returns {Object} Mutation result con mutate, isLoading, error, etc.
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

/**
 * Hook para actualizar una transacción
 * @returns {Object} Mutation result
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => transactionService.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidar queries relevantes
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook para eliminar una transacción
 * @returns {Object} Mutation result
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};