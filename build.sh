#!/bin/bash

# Installation des dépendances Python
echo "Installation des dépendances Python..."
pip install -r requirements.txt

# Installation des dépendances Node.js
echo "Installation des dépendances Node.js..."
npm install

# Construction du frontend si ce n'est pas fait
echo "Vérification et construction du frontend..."
npm run build