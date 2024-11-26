# Stage 1: Build the React app (Frontend)
FROM node:18-slim AS frontend-build
WORKDIR /app

# Copy all project files into the image
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Stage 2: Setup Nginx to serve the React App
FROM nginx:alpine AS frontend-server

# Copy built files from builder stage to nginx
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Setup the Backend
FROM node:18-slim AS backend
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server.js from its new location
COPY src/components/server.js ./
EXPOSE 3001
CMD ["node", "server.js"]
