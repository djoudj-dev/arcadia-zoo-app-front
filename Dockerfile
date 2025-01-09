# Utiliser une image Node.js comme base
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Angular
RUN npm run build -- --configuration production

# Utiliser une image Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers de build vers le répertoire Nginx
COPY --from=build /app/dist/arcadia-zoo-app-front /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]