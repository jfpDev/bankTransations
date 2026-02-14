# 🏦 Transactions Full Stack Application

Sistema de gestión de transacciones para usuarios desarrollado con **Spring Boot** y **React**.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Documentación API](#documentación-api)
- [Arquitectura](#arquitectura)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

## 📖 Descripción

Aplicación web full-stack para la gestión de transacciones de clientes. Permite crear, leer, actualizar y eliminar transacciones con validaciones de negocio y control de rate limiting.

### Funcionalidades Principales

- ✅ Crear nuevas transacciones
- ✅ Listar todas las transacciones
- ✅ Editar transacciones existentes
- ✅ Eliminar transacciones
- ✅ Validaciones de negocio en frontend y backend
- ✅ Rate limiting: 3 requests por minuto por cliente
- ✅ Caching con React Query


## 🔧 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone https://github.com/jfpDev/bankTransations.git
cd bankTransations
```

2. **Construir y ejecutar con Docker Compose**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- PostgreSQL: localhost:5432 (docker container)

4. **Detener los servicios**
```bash
docker-compose down
```

5. **Limpiar volúmenes (reiniciar BD)**
```bash
docker-compose down -v
```

### Opción 2: Desarrollo Local

#### Backend

```bash
cd backend

# Asegurar que PostgreSQL está corriendo
# Crear base de datos: tenpi_db

# Ejecutar con Maven
./mvnw spring-boot:run

# O compilar y ejecutar
./mvnw clean package
java -jar target/transactions-1.0.0.jar
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

## 📚 Documentación API

### Swagger UI

La documentación interactiva de la API está disponible en:

```
http://localhost:8080/swagger-ui.html
```

### Endpoints Principales

#### Transacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/transaction` | Obtener todas las transacciones |
| GET | `/api/transaction/{id}` | Obtener transacción por ID |
| GET | `/api/transaction/user/{name}` | Obtener transacciones por usuario |
| POST | `/api/transaction` | Crear nueva transacción |
| PUT | `/api/transaction/{id}` | Actualizar transacción |
| DELETE | `/api/transaction/{id}` | Eliminar transacción |

### Ejemplo de Request

**POST /api/transaction**

```json
{
  "amount": 15000,
  "businessCategory": "Supermercado",
  "tenpistaName": "Juan Pérez",
  "transactionDate": "2024-02-09T10:30:00"
}
```

**Response (201 Created)**

```json
{
  "id": 1,
  "amount": 15000,
  "businessCategory": "Supermercado",
  "tenpistaName": "Juan Pérez",
  "transactionDate": "2024-02-09T10:30:00",
  "createdAt": "2024-02-09T15:45:00",
  "updatedAt": "2024-02-09T15:45:00"
}
```

### Manejo de Errores

Todas las respuestas de error siguen este formato:

```json
{
  "status": 400,
  "error": "Validation Error",
  "message": "Error en la validación de los datos",
  "details": [
    "El monto no puede ser negativo",
    "El nombre del Tenpista es obligatorio"
  ],
  "timestamp": "2024-02-09T15:45:00",
  "path": "/api/transaction"
}
```

### Códigos de Estado HTTP

- `200` OK - Operación exitosa
- `201` Created - Recurso creado exitosamente
- `204` No Content - Recurso eliminado exitosamente
- `400` Bad Request - Error de validación o regla de negocio
- `404` Not Found - Recurso no encontrado
- `429` Too Many Requests - Rate limit excedido
- `500` Internal Server Error - Error interno del servidor

## 🏗 Arquitectura

### Backend (Spring Boot)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tenpi/transactions/
│   │   │   ├── config/          # Configuraciones (CORS, Rate Limit, Swagger)
│   │   │   ├── controller/      # Controladores REST
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Excepciones personalizadas y handlers
│   │   │   ├── model/           # Entidades JPA
│   │   │   ├── repository/      # Repositorios JPA
│   │   │   └── service/         # Lógica de negocio
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Tests unitarios
├── Dockerfile
└── pom.xml
```

### Frontend (React)

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/              # Componentes React
│   │   ├── TransactionList.js
│   │   ├── TransactionList.css
│   │   ├── TransactionForm.js
│   │   └── TransactionForm.css
│   ├── hooks/                   # Custom hooks (React Query)
│   ├── services/                # Cliente API (Axios)
│   ├── types/                   # Definiciones de tipos
│   ├── utils/                   # Utilidades y helpers
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── Dockerfile
├── nginx.conf
└── package.json
```

### Patrones de Diseño Utilizados

- **MVC** (Model-View-Controller)
- **Repository Pattern** para acceso a datos
- **Service Layer** para lógica de negocio
- **DTO Pattern** para transferencia de datos
- **Interceptor Pattern** para rate limiting
- **Custom Hooks** en React para reutilización de lógica

## 🧪 Testing

### Backend

Ejecutar tests unitarios:

```bash
cd backend
./mvnw test
```

Generar reporte de cobertura:

```bash
./mvnw test jacoco:report
```

### Cobertura de Tests

- **Servicios**: 100% de cobertura
- **Controladores**: 95% de cobertura
- **Repositorios**: Tests de integración con H2

### Tests Principales

- `TransactionServiceTest`: Tests de lógica de negocio
- `TransactionControllerTest`: Tests de endpoints REST
- Validaciones de campos
- Manejo de excepciones
- Rate limiting
- Reglas de negocio (límite de 100 transacciones, montos, fechas)

## 🐳 Docker

### Imágenes Docker

#### Backend
```bash
# Construir imagen
docker build -t tenpi-transactions-backend ./backend

# Ejecutar contenedor
docker run -p 8080:8080 \
  -e DB_HOST=database \
  -e DB_NAME=transactions_db \
  -e DB_USER=transactions_user \
  -e DB_PASSWORD=transactions_pass \
  -- network transactions-network
  transaction-service
```

#### Frontend
```bash
# Construir imagen
docker build -t tenpi-transactions-frontend ./frontend

# Ejecutar contenedor
docker run -p 3000:80 tenpi-transactions-frontend
```

### Publicar Imágenes en Docker Hub

```bash
# Login en Docker Hub
docker login

# Tag de las imágenes
docker tag transactions-service:latest jfelipepava/transactions-service:1.0.0
docker tag transactions-client:latest jfelipepava/transactions-client:1.0.0

# Push a Docker Hub
docker push jfelipepava/tenpi:transactions-service
docker push jfelipepava/tenpi:transactions-client
```

### Construir y correr de manera local la app

```bash
docker-compose up --build
```

### Descargar y correr las imagenes de los contenedores

```bash
docker pull jfelipepava/tenpi:transactions-service
docker pull jfelipepava/tenpi:transactions-client
docker pull postgres:latest

docker run --name postgresql -e POSTGRES_PASSWORD=transactions_pass -e POSTGRES_USER=transactions_user -e POSTGRES_DB=transactions_db -p 5432:5432 --network transactions-network -d postgres

docker run --name transaction-service -p 8080:8080   -e DB_HOST=postgresql   -e DB_NAME=transactions_db   -e DB_USER=transactions_user   -e DB_PASSWORD=transactions_pass   --network transactions-network transactions-service

docker run --name transaction-client -p 3000:3000 --network transactions-network transactions-client
```

## 📊 Características Técnicas Avanzadas

### Rate Limiting

Implementación con Bucket4j:
- **Límite**: 3 requests por minuto por cliente
- **Identificación**: Por IP o header `X-Client-Id`
- **Respuesta**: HTTP 429 con mensaje descriptivo
- **Header**: `X-Rate-Limit-Remaining` indica requests restantes

### Caching con React Query

```javascript
// Configuración de caché
{
  staleTime: 5 * 60 * 1000,  // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false
}
```

### Validaciones

**Backend (Bean Validation)**:
- `@NotNull`, `@NotBlank`, `@Size`
- `@Min`, `@PastOrPresent`
- Validaciones custom en servicios

**Frontend**:
- Validación en tiempo real
- Validación antes de envío
- Mensajes de error descriptivos

### Manejo de Errores

**Global Exception Handler** captura y formatea:
- `ResourceNotFoundException` → 404
- `BusinessException` → 400
- `RateLimitExceededException` → 429
- `MethodArgumentNotValidException` → 400
- `Exception` → 500



## 👥 Autor

Juan Felipe Pava

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado usando Spring Boot + React**