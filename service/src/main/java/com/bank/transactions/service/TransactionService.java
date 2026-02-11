package com.bank.transactions.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.transactions.dto.TransactionDTO;
import com.bank.transactions.entity.Transaction;
import com.bank.transactions.exception.BusinessException;
import com.bank.transactions.exception.ResourceNotFoundException;
import com.bank.transactions.repository.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de lógica de negocio para transacciones
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {
    
    private static final int MAX_TRANSACTIONS_PER_CLIENT = 100;
    
    private final TransactionRepository transactionRepository;
    
    /**
     * Obtiene todas las transacciones
     */
    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        log.info("Obteniendo todas las transacciones");
        return transactionRepository.findAllByOrderByTransactionDateDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene una transacción por ID
     */
    @Transactional(readOnly = true)
    public TransactionDTO getTransactionById(Integer id) {
        log.info("Obteniendo transacción con id: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", id));
        return convertToDTO(transaction);
    }
    
    /**
     * Obtiene todas las transacciones de un Tenpista
     */
    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsByTenpista(String tenpistaName) {
        log.info("Obteniendo transacciones del Tenpista: {}", tenpistaName);
        return transactionRepository.findByNameOrderByTransactionDateDesc(tenpistaName)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Crea una nueva transacción
     */
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        log.info("Creando nueva transacción para: {}", transactionDTO.getName());
        
        // Validar que el monto no sea negativo
        validateAmount(transactionDTO.getAmount());
                
        // Validar límite de transacciones por cliente
        validateTransactionLimit(transactionDTO.getName());
        
        Transaction transaction = convertToEntity(transactionDTO);
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        log.info("Transacción creada exitosamente con id: {}", savedTransaction.getId());
        return convertToDTO(savedTransaction);
    }
    
    /**
     * Actualiza una transacción existente
     */
    @Transactional
    public TransactionDTO updateTransaction(Integer id, TransactionDTO transactionDTO) {
        log.info("Actualizando transacción con id: {}", id);
        
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transacción", id));
        
        // Validar que el monto no sea negativo
        validateAmount(transactionDTO.getAmount());
        
        // Si se cambia el nombre del Tenpista, validar límite
        if (!existingTransaction.getName().equals(transactionDTO.getName())) {
            validateTransactionLimit(transactionDTO.getName());
        }
        
        // Actualizar campos
        existingTransaction.setAmount(transactionDTO.getAmount());
        existingTransaction.setBusinessName(transactionDTO.getBusinessName());
        existingTransaction.setName(transactionDTO.getName());
        
        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        
        log.info("Transacción actualizada exitosamente con id: {}", id);
        return convertToDTO(updatedTransaction);
    }
    
    /**
     * Elimina una transacción
     */
    @Transactional
    public void deleteTransaction(Integer id) {
        log.info("Eliminando transacción con id: {}", id);
        
        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transacción", id);
        }
        
        transactionRepository.deleteById(id);
        log.info("Transacción eliminada exitosamente con id: {}", id);
    }
    
    /**
     * Valida que el monto no sea negativo
     */
    private void validateAmount(Integer amount) {
        if (amount < 0) {
            throw new BusinessException("El monto de la transacción no puede ser negativo");
        }
    }
    
    /**
     * Valida que el cliente no exceda el límite de transacciones
     */
    private void validateTransactionLimit(String tenpistaName) {
        long count = transactionRepository.countByName(tenpistaName);
        if (count >= MAX_TRANSACTIONS_PER_CLIENT) {
            throw new BusinessException(
                String.format("El cliente %s ha alcanzado el límite máximo de %d transacciones",
                    tenpistaName, MAX_TRANSACTIONS_PER_CLIENT)
            );
        }
    }
    
    /**
     * Convierte una entidad a DTO
     */
    private TransactionDTO convertToDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .businessName(transaction.getBusinessName())
                .name(transaction.getName())
                .build();
    }
    
    /**
     * Convierte un DTO a entidad
     */
    private Transaction convertToEntity(TransactionDTO dto) {
        return Transaction.builder()
                .id(dto.getId())
                .amount(dto.getAmount())
                .businessName(dto.getBusinessName())
                .name(dto.getName())
                .transactionDate(LocalDateTime.now())
                .build();
    }
}
