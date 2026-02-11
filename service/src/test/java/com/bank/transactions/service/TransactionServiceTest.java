package com.bank.transactions.service;

import com.bank.transactions.dto.TransactionDTO;
import com.bank.transactions.exception.BusinessException;
import com.bank.transactions.exception.ResourceNotFoundException;
import com.bank.transactions.entity.Transaction;
import com.bank.transactions.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para TransactionService
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Transaction Service Tests")
class TransactionServiceTest {
    
    @Mock
    private TransactionRepository transactionRepository;
    
    @InjectMocks
    private TransactionService transactionService;
    
    private Transaction transaction;
    private TransactionDTO transactionDTO;
    
    @BeforeEach
    void setUp() {
        
        transaction = Transaction.builder()
                .id(1)
                .amount(10000)
                .businessName("Supermercado")
                .name("Juan Pérez")
                .build();
        
        transactionDTO = TransactionDTO.builder()
                .id(1)
                .amount(10000)
                .businessName("Supermercado")
                .name("Juan Pérez")
                .build();
    }
    
    @Test
    @DisplayName("Debe obtener todas las transacciones")
    void testGetAllTransactions() {
        // Given
        List<Transaction> transactions = Arrays.asList(transaction);
        when(transactionRepository.findAllByOrderByTransactionDateDesc()).thenReturn(transactions);
        
        // When
        List<TransactionDTO> result = transactionService.getAllTransactions();
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(transaction.getId(), result.get(0).getId());
        verify(transactionRepository, times(1)).findAllByOrderByTransactionDateDesc();
    }
    
    @Test
    @DisplayName("Debe obtener transacción por ID")
    void testGetTransactionById() {
        // Given
        when(transactionRepository.findById(1)).thenReturn(Optional.of(transaction));
        
        // When
        TransactionDTO result = transactionService.getTransactionById(1);
        
        // Then
        assertNotNull(result);
        assertEquals(transaction.getId(), result.getId());
        assertEquals(transaction.getAmount(), result.getAmount());
        verify(transactionRepository, times(1)).findById(1);
    }
    
    @Test
    @DisplayName("Debe lanzar excepción cuando transacción no existe")
    void testGetTransactionByIdNotFound() {
        // Given
        when(transactionRepository.findById(999)).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, 
            () -> transactionService.getTransactionById(999));
        verify(transactionRepository, times(1)).findById(999);
    }
    
    @Test
    @DisplayName("Debe crear transacción exitosamente")
    void testCreateTransaction() {
        // Given
        when(transactionRepository.countByName(anyString())).thenReturn(50L);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        
        // When
        TransactionDTO result = transactionService.createTransaction(transactionDTO);
        
        // Then
        assertNotNull(result);
        assertEquals(transaction.getId(), result.getId());
        verify(transactionRepository, times(1)).countByName(anyString());
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("Debe lanzar excepción cuando monto es negativo")
    void testCreateTransactionWithNegativeAmount() {
        // Given
        transactionDTO.setAmount(-1000);
        
        // When & Then
        assertThrows(BusinessException.class, 
            () -> transactionService.createTransaction(transactionDTO));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("Debe lanzar excepción cuando se excede límite de transacciones")
    void testCreateTransactionExceedsLimit() {
        // Given
        when(transactionRepository.countByName(anyString())).thenReturn(100L);
        
        // When & Then
        assertThrows(BusinessException.class, 
            () -> transactionService.createTransaction(transactionDTO));
        verify(transactionRepository, times(1)).countByName(anyString());
        verify(transactionRepository, never()).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("Debe actualizar transacción exitosamente")
    void testUpdateTransaction() {
        // Given
        when(transactionRepository.findById(1)).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);
        
        transactionDTO.setAmount(15000);
        
        // When
        TransactionDTO result = transactionService.updateTransaction(1, transactionDTO);
        
        // Then
        assertNotNull(result);
        verify(transactionRepository, times(1)).findById(1);
        verify(transactionRepository, times(1)).save(any(Transaction.class));
    }
    
    @Test
    @DisplayName("Debe eliminar transacción exitosamente")
    void testDeleteTransaction() {
        // Given
        when(transactionRepository.existsById(1)).thenReturn(true);
        doNothing().when(transactionRepository).deleteById(1);
        
        // When
        transactionService.deleteTransaction(1);
        
        // Then
        verify(transactionRepository, times(1)).existsById(1);
        verify(transactionRepository, times(1)).deleteById(1);
    }
    
    @Test
    @DisplayName("Debe lanzar excepción al eliminar transacción inexistente")
    void testDeleteTransactionNotFound() {
        // Given
        when(transactionRepository.existsById(999)).thenReturn(false);
        
        // When & Then
        assertThrows(ResourceNotFoundException.class, 
            () -> transactionService.deleteTransaction(999));
        verify(transactionRepository, times(1)).existsById(999);
        verify(transactionRepository, never()).deleteById(anyInt());
    }
}