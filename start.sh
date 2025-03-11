
#!/bin/bash

# Tuer tous les processus python et node existants
pkill -f "python run_django.py" || true
pkill -f "node.*server/index.ts" || true

# Attendre que les ports soient libérés
sleep 2

# Démarrer le serveur Django en arrière-plan
echo "Démarrage du serveur Django..."
python run_django.py &
DJANGO_PID=$!

# Attendre que le serveur Django soit prêt
echo "Attente du démarrage de Django..."
sleep 10

# Démarrer le serveur Node
echo "Démarrage du serveur Node..."
npm run dev

# Si le processus Node se termine, tuer aussi le processus Django
kill $DJANGO_PID
