#!/bin/sh
# Copier votre config personnalisée
cp /etc/nginx/conf.d/default.conf.original /etc/nginx/conf.d/default.conf

# Afficher pour vérification
echo "Configuration Nginx active :"
cat /etc/nginx/conf.d/default.conf

# Démarrer Nginx
exec nginx -g "daemon off;"
