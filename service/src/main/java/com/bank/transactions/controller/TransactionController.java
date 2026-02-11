package com.bank.transactions.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bank.transactions.dto.TransactionDTO;
import com.bank.transactions.service.TransactionService;

import java.util.List;

/**
 * Controlador REST para operaciones CRUD de transacciones
 */
@RestController
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Transactions", description = "API para gestión de transacciones de Tenpistas")
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @Operation(
        summary = "Obtener todas las transacciones",
        description = "Retorna una lista de todas las transacciones ordenadas por fecha descendente"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de transacciones obtenida exitosamente",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = TransactionDTO.class))
            )
        ),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        log.info("GET /api/transaction - Obteniendo todas las transacciones");
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @Operation(
        summary = "Obtener transacción por ID",
        description = "Retorna una transacción específica basándose en su ID"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Transacción encontrada",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TransactionDTO.class)
            )
        ),
        @ApiResponse(responseCode = "404", description = "Transacción no encontrada"),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(
            @Parameter(description = "ID de la transacción", required = true)
            @PathVariable Integer id) {
        
        log.info("GET /api/transaction/{} - Obteniendo transacción", id);
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }
    
    @Operation(
        summary = "Obtener transacciones por Tenpista",
        description = "Retorna todas las transacciones de un Tenpista específico"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Transacciones encontradas",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = TransactionDTO.class))
            )
        ),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/user/{name}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByTenpista(
            @Parameter(description = "Nombre del Tenpista", required = true)
            @PathVariable String name) {
        
        log.info("GET /api/transaction/tenpista/{} - Obteniendo transacciones", name);
        List<TransactionDTO> transactions = transactionService.getTransactionsByTenpista(name);
        return ResponseEntity.ok(transactions);
    }
    
    @Operation(
        summary = "Crear nueva transacción",
        description = "Crea una nueva transacción con validaciones de negocio"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Transacción creada exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TransactionDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o regla de negocio violada"),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @Parameter(description = "Datos de la transacción", required = true)
            @Valid @RequestBody TransactionDTO transactionDTO) {
        
        log.info("POST /api/transaction - Creando nueva transacción");
        TransactionDTO createdTransaction = transactionService.createTransaction(transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }
    
    @Operation(
        summary = "Actualizar transacción existente",
        description = "Actualiza una transacción existente con validaciones de negocio"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Transacción actualizada exitosamente",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TransactionDTO.class)
            )
        ),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos o regla de negocio violada"),
        @ApiResponse(responseCode = "404", description = "Transacción no encontrada"),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @Parameter(description = "ID de la transacción", required = true)
            @PathVariable Integer id,
            @Parameter(description = "Datos actualizados de la transacción", required = true)
            @Valid @RequestBody TransactionDTO transactionDTO) {
        
        log.info("PUT /api/transaction/{} - Actualizando transacción", id);
        TransactionDTO updatedTransaction = transactionService.updateTransaction(id, transactionDTO);
        return ResponseEntity.ok(updatedTransaction);
    }
    
    @Operation(
        summary = "Eliminar transacción",
        description = "Elimina una transacción existente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Transacción eliminada exitosamente"),
        @ApiResponse(responseCode = "404", description = "Transacción no encontrada"),
        @ApiResponse(responseCode = "429", description = "Rate limit excedido"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @Parameter(description = "ID de la transacción", required = true)
            @PathVariable Integer id) {
        
        log.info("DELETE /api/transaction/{} - Eliminando transacción", id);
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
