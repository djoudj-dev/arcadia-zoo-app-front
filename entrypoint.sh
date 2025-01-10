#!/bin/sh
# Toujours restaurer la config personnalisée
cp /etc/nginx/conf.d/default.conf.original /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
