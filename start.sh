#!/bin/bash

# Tuer tous les processus Node.js et Python en cours
echo "Arrêt des processus en cours..."
pkill -f "node.*server/index.ts" || true
pkill -f "python.*run_django.py" || true

# Démarrer le backend Django
echo "Démarrage du serveur Django..."
python run_django.py &

# Attendre que le serveur Django soit prêt
echo "Attente du démarrage de Django..."
sleep 5

# Démarrer le serveur Node.js
echo "Démarrage du serveur Node..."
npm run dev
