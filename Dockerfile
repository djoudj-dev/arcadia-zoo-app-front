# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/arcadia-zoo-app-front /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
