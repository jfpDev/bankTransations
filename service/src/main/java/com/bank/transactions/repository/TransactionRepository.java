package com.bank.transactions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bank.transactions.entity.Transaction;

import java.util.List;

/**
 * Repositorio para operaciones de base de datos de transacciones
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    
    /**
     * Encuentra todas las transacciones de un usuario
     */
    List<Transaction> findByNameOrderByTransactionDateDesc(String tenpistaName);
    
    /**
     * Cuenta el número de transacciones de un usuario
     */
    long countByName(String tenpistaName);
    
    /**
     * Encuentra todas las transacciones ordenadas por fecha descendente
     */
    List<Transaction> findAllByOrderByTransactionDateDesc();
    
    /**
     * Verifica si un usuario existe
     */
    boolean existsByName(String tenpistaName);
}