package com.bank.transactions.exception;

/**
 * Excepción lanzada cuando se excede el límite de requests
 */
public class RateLimitExceededException extends RuntimeException {
    
    public RateLimitExceededException(String message) {
        super(message);
    }
}

