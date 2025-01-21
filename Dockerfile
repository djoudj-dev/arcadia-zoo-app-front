# ---- Étape de build ----
# Utilise Node.js 18 avec Alpine comme image de base pour le build
FROM node:18-alpine AS build
# Définit le répertoire de travail dans le conteneur
WORKDIR /app
# Copie les fichiers package.json et package-lock.json
COPY package*.json ./
# Installe les dépendances
RUN npm install
# Copie tout le code source
COPY . .
# Build l'application Angular en mode production
RUN npm run build -- --configuration production

# ---- Étape de production ----
# Utilise Nginx Alpine comme image finale légère
FROM nginx:alpine
# Crée le répertoire pour les fichiers statiques
RUN mkdir -p /usr/share/nginx/html/browser
# Copie les fichiers buildés depuis l'étape de build
COPY --from=build /app/dist/arcadia-zoo-app-front/browser /usr/share/nginx/html/browser
# Copie la configuration Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Expose le port 80
EXPOSE 80
# Démarre Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
