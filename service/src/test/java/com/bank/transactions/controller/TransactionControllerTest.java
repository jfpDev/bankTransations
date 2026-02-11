package com.bank.transactions.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.bank.transactions.dto.TransactionDTO;
import com.bank.transactions.exception.ResourceNotFoundException;
import com.bank.transactions.service.TransactionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests unitarios para TransactionController
 */
@WebMvcTest(TransactionController.class)
@DisplayName("Transaction Controller Tests")
class TransactionControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @MockBean
    private TransactionService transactionService;
    
    private TransactionDTO transactionDTO;
    
    @BeforeEach
    void setUp() {
        
        transactionDTO = TransactionDTO.builder()
                .id(1)
                .amount(10000)
                .businessName("Supermercado")
                .name("Juan Pérez")
                .build();
    }
    
    @Test
    @DisplayName("GET /api/transaction debe retornar lista de transacciones")
    void testGetAllTransactions() throws Exception {
        // Given
        List<TransactionDTO> transactions = Arrays.asList(transactionDTO);
        when(transactionService.getAllTransactions()).thenReturn(transactions);
        
        // When & Then
        mockMvc.perform(get("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].amount").value(10000))
                .andExpect(jsonPath("$[0].tenpistaName").value("Juan Pérez"));
        
        verify(transactionService, times(1)).getAllTransactions();
    }
    
    @Test
    @DisplayName("GET /api/transaction/{id} debe retornar transacción")
    void testGetTransactionById() throws Exception {
        // Given
        when(transactionService.getTransactionById(1)).thenReturn(transactionDTO);
        
        // When & Then
        mockMvc.perform(get("/api/transaction/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(10000));
        
        verify(transactionService, times(1)).getTransactionById(1);
    }
    
    @Test
    @DisplayName("GET /api/transaction/{id} debe retornar 404 cuando no existe")
    void testGetTransactionByIdNotFound() throws Exception {
        // Given
        when(transactionService.getTransactionById(999))
                .thenThrow(new ResourceNotFoundException("Transacción", 999));
        
        // When & Then
        mockMvc.perform(get("/api/transaction/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
        
        verify(transactionService, times(1)).getTransactionById(999);
    }
    
    @Test
    @DisplayName("POST /api/transaction debe crear transacción")
    void testCreateTransaction() throws Exception {
        // Given
        when(transactionService.createTransaction(any(TransactionDTO.class)))
                .thenReturn(transactionDTO);
        
        // When & Then
        mockMvc.perform(post("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transactionDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(10000));
        
        verify(transactionService, times(1)).createTransaction(any(TransactionDTO.class));
    }
    
    @Test
    @DisplayName("POST /api/transaction debe retornar 400 con datos inválidos")
    void testCreateTransactionWithInvalidData() throws Exception {
        // Given
        TransactionDTO invalidDTO = TransactionDTO.builder()
                .amount(-1000)  // Monto negativo
                .build();
        
        // When & Then
        mockMvc.perform(post("/api/transaction")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest());
        
        verify(transactionService, never()).createTransaction(any(TransactionDTO.class));
    }
    
    @Test
    @DisplayName("PUT /api/transaction/{id} debe actualizar transacción")
    void testUpdateTransaction() throws Exception {
        // Given
        transactionDTO.setAmount(15000);
        when(transactionService.updateTransaction(eq(1), any(TransactionDTO.class)))
                .thenReturn(transactionDTO);
        
        // When & Then
        mockMvc.perform(put("/api/transaction/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(transactionDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.amount").value(15000));
        
        verify(transactionService, times(1)).updateTransaction(eq(1), any(TransactionDTO.class));
    }
    
    @Test
    @DisplayName("DELETE /api/transaction/{id} debe eliminar transacción")
    void testDeleteTransaction() throws Exception {
        // Given
        doNothing().when(transactionService).deleteTransaction(1);
        
        // When & Then
        mockMvc.perform(delete("/api/transaction/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
        
        verify(transactionService, times(1)).deleteTransaction(1);
    }
}