# Étape de construction
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

# Construire l'application Angular
RUN npm run build -- --configuration production

# Étape de déploiement
FROM nginx:alpine

# Copie les fichiers du build Angular dans le répertoire NGINX
COPY --from=build /app/dist/arcadia-zoo-app-front /usr/share/nginx/html/browser

# Copie la configuration personnalisée de NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Démarrer NGINX
CMD ["nginx", "-g", "daemon off;"]
