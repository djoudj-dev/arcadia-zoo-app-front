# Étape de construction
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers package*.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Angular
RUN npm run build -- --configuration production

# Étape de déploiement
FROM nginx:alpine

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build Angular dans le répertoire NGINX
COPY --from=build /app/dist/arcadia-zoo-app-front/browser /usr/share/nginx/html/browser

# Exposer le port 80
EXPOSE 80

# Démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
