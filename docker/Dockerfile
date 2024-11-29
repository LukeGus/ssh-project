# Base image for React frontend build
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend install
COPY frontend/ ./frontend/
RUN npm --prefix frontend run build

# Base image for backend build
FROM node:18-alpine AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Install Guacamole dependencies and build GuacD
FROM ubuntu:20.04 AS guacd-build
WORKDIR /tmp

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential libcairo2-dev libjpeg-turbo8-dev libpng-dev \
    libossp-uuid-dev libvncserver-dev libpulse-dev libssl-dev \
    libssh2-1-dev libtelnet-dev libwebp-dev libfreerdp-dev \
    freerdp2-dev libavcodec-dev libavutil-dev libavformat-dev \
    libswscale-dev libvorbis-dev libwebsockets-dev tomcat9 \
    wget curl git && \
    apt-get clean

# Download and build Guacamole Server (GuacD)
RUN wget https://downloads.apache.org/guacamole/1.5.3/source/guacamole-server-1.5.3.tar.gz && \
    tar -xzf guacamole-server-1.5.3.tar.gz && \
    cd guacamole-server-1.5.3 && \
    ./configure --with-init-dir=/etc/init.d && make && make install && \
    ldconfig

# Final image with NGINX, GuacD, and application
FROM nginx:alpine
WORKDIR /

# Install necessary packages
RUN apk add --no-cache bash openjdk17-jre

# Copy GuacD binary
COPY --from=guacd-build /usr/local/sbin/guacd /usr/local/sbin/guacd

# Copy React frontend build
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy backend code
COPY --from=backend-build /backend /backend

# NGINX configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Startup script for GuacD, backend, and NGINX
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 8080 8081 4822

# Entry point
ENTRYPOINT ["/entrypoint.sh"]