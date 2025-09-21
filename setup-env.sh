#!/bin/bash

# Script pour copier les fichiers template d'environnement
# Utilise ce script pour configurer tes environnements localement

echo "Configuration des fichiers d'environnement..."

# Copie les templates vers les vrais fichiers s'ils n'existent pas
if [ ! -f "src/environments/environment.ts" ]; then
    cp src/environments/environment.template.ts src/environments/environment.ts
    echo "✓ environment.ts créé"
fi

if [ ! -f "src/environments/environment.prod.ts" ]; then
    cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
    echo "✓ environment.prod.ts créé"
fi

if [ ! -f "src/environments/environment.development.ts" ]; then
    cp src/environments/environment.development.template.ts src/environments/environment.development.ts
    echo "✓ environment.development.ts créé"
fi

echo "Configuration terminée. Tu peux maintenant modifier les fichiers d'environnement selon tes besoins."