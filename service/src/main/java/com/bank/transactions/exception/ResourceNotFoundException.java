package com.bank.transactions.exception;



/**
 * Excepción lanzada cuando un recurso no es encontrado
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resource, Integer id) {
        super(String.format("%s no encontrado con id: %d", resource, id));
    }
}
