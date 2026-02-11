import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../utils/helpers';

import '../styles/TransactionList.css';

interface Transaction {
  id: string | number;
  name: string;
  amount: number;
  businessName: string;
  transactionDate: string;
}

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string | number) => void;
  isLoading: boolean;
}

/**
 * Componente para mostrar la lista de transacciones
 */
const TransactionList = ({ transactions, onEdit, onDelete, isLoading }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtrar transacciones por término de búsqueda
  const filteredTransactions = transactions?.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.name.toLowerCase().includes(searchLower) ||
      transaction.businessName.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Ordenar transacciones
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.transactionDate);
        bValue = new Date(b.transactionDate);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="transaction-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando transacciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h2>Transacciones</h2>
        <div className="list-controls">
          <input
            type="text"
            placeholder="Buscar por nombre o comercio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Ordenar por Fecha</option>
            <option value="amount">Ordenar por Monto</option>
            <option value="name">Ordenar por Nombre</option>
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="no-transactions">
          <p>No hay transacciones para mostrar</p>
          {searchTerm && <p className="hint">Intenta cambiar tu búsqueda</p>}
        </div>
      ) : (
        <div className="table-container">
          <table className="transaction-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Tenpista
                  {sortBy === 'name' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('amount')} className="sortable">
                  Monto
                  {sortBy === 'amount' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
                <th>Giro/Comercio</th>
                <th onClick={() => handleSort('date')} className="sortable">
                  Fecha
                  {sortBy === 'date' && (
                    <span className="sort-indicator">
                      {sortOrder === 'asc' ? ' ▲' : ' ▼'}
                    </span>
                  )}
                </th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="name-cell">{transaction.name}</td>
                  <td className="amount-cell">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="business-cell">{transaction.businessName}</td>
                  <td className="date-cell">
                    {formatDate(transaction.transactionDate)}
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="btn btn-edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="btn btn-delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="list-footer">
        <p>Total: {sortedTransactions.length} transacción(es)</p>
        {searchTerm && (
          <p className="filter-info">
            Mostrando resultados para: "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;