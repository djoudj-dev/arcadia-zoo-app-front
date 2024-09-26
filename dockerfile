# Étape 1 : Utiliser Node.js pour construire le projet Angular
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers de l'application et construire le projet Angular
COPY . .
RUN npm run build -- --configuration production

# Étape 2 : Utiliser Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers compilés de l'étape précédente dans le répertoire Nginx
COPY --from=build /app/dist/arcadia-zoo-app-front /var/www/vhosts/nedellec-julien.fr/httpdocs

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
