# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first to cache npm install layer
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .
ENV REACT_APP_API_URL=http://localhost:8080
RUN npm run build

# ─── Stage 2: Serve with Nginx ────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config and replace with our SPA config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
