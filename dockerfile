# Utiliser une image de base officielle Node.js

FROM node:18

# Définir le répertoire de travail dans le conteneur

WORKDIR /app

# Copier le fichier package.json et package-lock.json

COPY package\*.json ./

# Installer les dépendances de l'application

RUN npm install

# Copier le reste des fichiers de l'application

COPY . .

# Exposer le port sur lequel l'application va tourner

EXPOSE 4200

# Démarrer l'application

CMD ["npm", "start"]
