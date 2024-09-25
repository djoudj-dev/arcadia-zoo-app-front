# Utiliser une image de base officielle Node.js pour le build

FROM node:18 as build

# Définir le répertoire de travail dans le conteneur

WORKDIR /app

# Copier le fichier package.json et installer les dépendances

COPY package\*.json ./
RUN npm install

# Copier le reste des fichiers de l'application et construire le projet Angular

COPY . .
RUN npm run build -- --configuration production

# Utiliser Nginx pour servir l'application en production

FROM nginx:alpine
COPY --from=build /app/dist/arcadia-zoo-app-front /usr/share/nginx/html

# Exposer le port 80 pour le serveur Nginx

EXPOSE 80

# Nginx démarre automatiquement, donc pas besoin de CMD
