import React, { useState, useEffect } from 'react';
import {
  validateTransaction,
  formatDateForInput,
  getCurrentDateTime,
} from '../utils/helpers';
import './TransactionForm.css';

/**
 * Componente para crear y editar transacciones
 */
const TransactionForm = ({ transaction, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    businessCategory: '',
    tenpistaName: '',
    transactionDate: getCurrentDateTime(),
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Inicializar formulario con datos de transacción existente
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || '',
        businessCategory: transaction.businessCategory || '',
        tenpistaName: transaction.tenpistaName || '',
        transactionDate: transaction.transactionDate
          ? formatDateForInput(transaction.transactionDate)
          : getCurrentDateTime(),
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validar campo individual
    const validation = validateTransaction(formData);
    if (validation.errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      amount: true,
      businessCategory: true,
      tenpistaName: true,
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
      amount: parseInt(formData.amount, 10),
      transactionDate: new Date(formData.transactionDate).toISOString(),
    };

    onSubmit(transactionData);
  };

  const handleReset = () => {
    setFormData({
      amount: '',
      businessCategory: '',
      tenpistaName: '',
      transactionDate: getCurrentDateTime(),
    });
    setErrors({});
    setTouched({});
  };

  const isEditMode = !!transaction;

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
          <label htmlFor="tenpistaName">
            Nombre del Tenpista <span className="required">*</span>
          </label>
          <input
            type="text"
            id="tenpistaName"
            name="tenpistaName"
            value={formData.tenpistaName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.tenpistaName && touched.tenpistaName ? 'error' : ''}
            placeholder="Ej: Juan Pérez"
            disabled={isLoading}
          />
          {errors.tenpistaName && touched.tenpistaName && (
            <span className="error-message">{errors.tenpistaName}</span>
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
          <label htmlFor="businessCategory">
            Giro o Comercio <span className="required">*</span>
          </label>
          <input
            type="text"
            id="businessCategory"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.businessCategory && touched.businessCategory ? 'error' : ''}
            placeholder="Ej: Supermercado, Restaurant, Farmacia"
            disabled={isLoading}
          />
          {errors.businessCategory && touched.businessCategory && (
            <span className="error-message">{errors.businessCategory}</span>
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