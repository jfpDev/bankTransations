package com.bank.transactions.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.bank.transactions.exception.RateLimitExceededException;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Interceptor para implementar rate limiting usando Bucket4j
 * Límite: 3 requests por minuto por cliente
 */
@Component
@Slf4j
public class RateLimitInterceptor implements HandlerInterceptor {
    
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();
    
    /**
     * Crea un nuevo bucket con límite de 3 requests por minuto
     */
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
    
    /**
     * Resuelve el bucket para un cliente específico
     */
    private Bucket resolveBucket(String clientId) {
        return cache.computeIfAbsent(clientId, k -> createNewBucket());
    }
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                            Object handler) throws Exception {
        
        // Obtener identificador del cliente (IP o header personalizado)
        String clientId = getClientIdentifier(request);
        
        Bucket bucket = resolveBucket(clientId);
        
        // Intentar consumir un token
        if (bucket.tryConsume(1)) {
            // Agregar headers informativos
            response.addHeader("X-Rate-Limit-Remaining", 
                String.valueOf(bucket.getAvailableTokens()));
            return true;
        } else {
            log.warn("Rate limit excedido para cliente: {}", clientId);
            throw new RateLimitExceededException(
                "Has excedido el límite de 3 requests por minuto. Por favor, intenta más tarde."
            );
        }
    }
    
    /**
     * Obtiene un identificador único del cliente
     * Prioriza header X-Client-Id, luego IP
     */
    private String getClientIdentifier(HttpServletRequest request) {
        String clientId = request.getHeader("X-Client-Id");
        
        if (clientId == null || clientId.isEmpty()) {
            clientId = request.getRemoteAddr();
        }
        
        return clientId;
    }
}
