FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production
FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html/browser
COPY --from=build /app/dist/arcadia-zoo-app-front/browser /usr/share/nginx/html/browser
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
