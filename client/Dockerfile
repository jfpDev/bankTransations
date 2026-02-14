# Etapa 1: Build
FROM node:21.5.0 AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
# RUN npm ci --only=production

# Copiar código fuente y construir
COPY . .
RUN npm run build

# # Etapa 2: Servir con Nginx
# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html

# # Eliminar archivos por defecto de Nginx
# RUN rm -rf ./*

# # Copiar build desde la etapa anterior
# COPY --from=build /app/build .

# # Copiar configuración personalizada de Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000 || exit 1

# Ejecutar Nginx
CMD ["npm", "start"]