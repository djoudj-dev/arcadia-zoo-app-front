# Étape de construction
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Angular
RUN npm run build -- --configuration production

# Étape de déploiement
FROM nginx:alpine

# Copier les fichiers de build Angular dans le répertoire NGINX
COPY --from=build /app/dist/arcadia-zoo-app-front /usr/share/nginx/html/browser

# Copier la configuration personnalisée de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
