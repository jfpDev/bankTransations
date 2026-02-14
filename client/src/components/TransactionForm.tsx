import React, { useState, useEffect } from 'react';
import {
  validateTransaction,
  formatDateForInput,
  getCurrentDateTime,
} from '../utils/helpers';
import { Transaction } from '../types';

import '../styles/TransactionForm.css';


interface TransactionFormType {
  transaction?: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
  isLoading: boolean;
}
export type TransactionType = {
  amount: number;
  businessName: string;
  name: string;
  transactionDate: string;
}
export const initialData = {
  amount: 0,
  businessName: '',
  name: '',
  transactionDate: getCurrentDateTime(),
}

const TransactionForm = ({ transaction, onSubmit, onCancel, isLoading }: TransactionFormType) => {
  const [formData, setFormData] = useState<TransactionType>(initialData);

  const [errors, setErrors] = useState<Partial<Record<keyof TransactionType, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TransactionType, boolean>>>({});

  // Inicializar formulario con datos de transacción existente
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || 0,
        businessName: transaction.businessName || '',
        name: transaction.name || '',
        transactionDate: transaction.transactionDate
          ? formatDateForInput(transaction.transactionDate)
          : getCurrentDateTime(),
      });
    }
  }, [transaction]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof TransactionType]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e: any) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar campo individual
    const validation = validateTransaction(formData) as any;
    if (validation.errors && validation.errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name],
      }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      amount: true,
      businessName: true,
      name: true,
      transactionDate: true,
    });

    // Validar todos los campos
    const validation = validateTransaction(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Preparar datos para enviar
    const transactionData = {
      ...formData,
      amount: formData.amount,
      transactionDate: new Date(formData.transactionDate).toISOString(),
    };

    onSubmit(transactionData);
    setFormData(initialData);
  };

  const handleReset = () => {
    setFormData({
      amount: 0,
      businessName: '',
      name: '',
      transactionDate: getCurrentDateTime(),
    });
    setErrors({});
    setTouched({});
  };

  const isEditMode = transaction?.amount !== 0;

  return (
    <div className="transaction-form-container">
      <div className="form-header">
        <h2>{isEditMode ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
        {isEditMode && (
          <button onClick={onCancel} className="btn-close" title="Cerrar">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="name">
            Nombre del Usuario <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? 'error' : ''}
            placeholder="Ej: Juan Pérez"
            disabled={isLoading}
          />
          {errors.name && touched.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">
              Monto (CLP) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.amount && touched.amount ? 'error' : ''}
              placeholder="Ej: 15000"
              min="0"
              step="1"
              disabled={isLoading}
            />
            {errors.amount && touched.amount && (
              <span className="error-message">{errors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="transactionDate">
              Fecha de Transacción <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.transactionDate && touched.transactionDate ? 'error' : ''}
              max={getCurrentDateTime()}
              disabled={isLoading}
            />
            {errors.transactionDate && touched.transactionDate && (
              <span className="error-message">{errors.transactionDate}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="businessName">
            Giro o Comercio <span className="required">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.businessName && touched.businessName ? 'error' : ''}
            placeholder="Ej: Supermercado, Restaurante, Farmacia"
            disabled={isLoading}
          />
          {errors.businessName && touched.businessName && (
            <span className="error-message">{errors.businessName}</span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner"></span>
                Guardando...
              </>
            ) : (
              <>{isEditMode ? 'Actualizar' : 'Crear'} Transacción</>
            )}
          </button>

          {isEditMode ? (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      <div className="form-info">
        <p className="info-text">
          <strong>Nota:</strong> Cada cliente puede tener un máximo de 100
          transacciones.
        </p>
      </div>
    </div>
  );
};

export default TransactionForm;