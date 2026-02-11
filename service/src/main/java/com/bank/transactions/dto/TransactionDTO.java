package com.bank.transactions.dto;

import jakarta.validation.constraints.*;
import lombok.*;


/**
 * DTO para transferencia de datos de transacciones
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    
    private Integer id;
    
    @NotNull(message = "El monto de la transacción es obligatorio")
    @Min(value = 0, message = "El monto no puede ser negativo")
    private Integer amount;
    
    @NotBlank(message = "El giro o comercio es obligatorio")
    @Size(max = 255, message = "El giro no puede exceder 255 caracteres")
    private String businessName;
    
    @NotBlank(message = "El nombre del Tenpista es obligatorio")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String name;
}
