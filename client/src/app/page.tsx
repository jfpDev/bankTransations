'use client'

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../hooks/useTransactions';
import '../styles/App.css';

// Configurar React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function AppContent() {
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Hooks de React Query
  const { data: transactions, isLoading } = useTransactions();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Handler para crear transacción
  const handleCreate = async (transactionData) => {
    try {
      await createMutation.mutateAsync(transactionData);
      toast.success('Transacción creada exitosamente');
    } catch (error) {
      toast.error(error.message || 'Error al crear la transacción');
    }
  };

  // Handler para actualizar transacción
  const handleUpdate = async (transactionData) => {
    try {
      await updateMutation.mutateAsync({
        id: (editingTransaction as any).id,
        data: transactionData,
      });
      toast.success('Transacción actualizada exitosamente');
      setEditingTransaction(null);
    } catch (error) {
      toast.error(error.message || 'Error al actualizar la transacción');
    }
  };

  // Handler para eliminar transacción
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Transacción eliminada exitosamente');
      } catch (error) {
        toast.error(error.message || 'Error al eliminar la transacción');
      }
    }
  };

  // Handler para editar transacción
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler para cancelar edición
  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🏦 User Transactions</h1>
          <p className="subtitle">Sistema de Gestión de Transacciones</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TransactionForm
            transaction={editingTransaction}
            onSubmit={editingTransaction ? handleUpdate : handleCreate}
            onCancel={handleCancelEdit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© 2024 Tenpi Transactions - Sistema de Gestión de Transacciones</p>
          <p className="footer-info">
            Desarrollado con React + Spring Boot | Rate Limit: 3 requests/minuto
          </p>
        </div>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;