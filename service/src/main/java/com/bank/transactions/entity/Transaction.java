package com.bank.transactions.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad que representa una transacción de un banco.
 */
@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_person_name", columnList = "name"),
    @Index(name = "idx_transaction_date", columnList = "transaction_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @NotNull(message = "El monto de la transacción es obligatorio")
    @Min(value = 0, message = "El monto no puede ser negativo")
    @Column(name = "amount", nullable = false)
    private Integer amount;
    
    @NotBlank(message = "El giro o comercio es obligatorio")
    @Size(max = 255, message = "El giro no puede exceder 255 caracteres")
    @Column(name = "business_name", nullable = false)
    private String businessName;
    
    @NotBlank(message = "El nombre de la persona es obligatorio")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    @Column(name = "name", nullable = false)
    private String name;
    
    @NotNull(message = "La fecha de transacción es obligatoria")
    @PastOrPresent(message = "La fecha de transacción no puede ser futura")
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
}
