### Employment Tracker
Employment Tracker est une application de gestion des personnes et de leurs emplois. Ce projet est composé d'un backend en Node.js/Express et d'un frontend en Vue.js.

## Prérequis
Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

Node.js (version 16 ou supérieure)
npm ou yarn
PostgreSQL (version 12 ou supérieure)


# Installation
1. Cloner le dépôt
bash
Copier le code
git clone https://github.com/LucieChev/EmploymentTracker.git
cd EmploymentTracker/

2. Configurer les variables d'environnement
Backend
Dans le dossier backend, créez un fichier .env : 
cp .env.example .env

Frontend
Dans le dossier frontend, créez un fichier .env :
cp .env.example .env

# Démarrage du projet
1. Backend
Installer les dépendances
    cd backend
    npm install
Lancer le serveur
    npm run dev
Le serveur sera disponible à l'adresse : http://localhost:3000.

2. Frontend
Installer les dépendances
    cd ../frontend
    npm install
Lancer le frontend
    npm run dev
Le frontend sera disponible à l'adresse : http://localhost:5173.

# Fonctionnalités principales
Ajouter des personnes
Ajouter des emplois à des personnes
Filtrer les emplois par dates

# Documentation Swagger
http://localhost:3000/api-docs

# Développement
Structure du projet
backend/ : API et logique métier (Node.js, Express, Sequelize)
frontend/ : Interface utilisateur (Vue.js, TailwindCSS)
Problèmes courants


# Contributions
Les contributions sont les bienvenues. Merci de suivre les règles de contribution de ce dépôt.

# Licence
Ce projet est sous licence MIT.