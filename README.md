# 🦁 Zoo Arcadia - Application Frontend

![Angular](https://img.shields.io/badge/Angular-19.2.0-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.0-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.12-cyan)
![License](https://img.shields.io/badge/License-Private-lightgrey)

Application frontend moderne pour le Zoo Arcadia, développée avec Angular 19 et TailwindCSS. Cette interface utilisateur interactive permet la gestion complète d'un parc zoologique avec des tableaux de bord dédiés pour les différents types d'utilisateurs.

## 📋 Table des matières

- [🔧 Prérequis](#-prérequis)
- [🚀 Installation](#-installation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [👥 Gestion des rôles](#-gestion-des-rôles)
- [🎨 Design System](#-design-system)
- [🔐 Sécurité](#-sécurité)
- [📱 Pages principales](#-pages-principales)
- [🔗 Intégration Backend](#-intégration-backend)

## 🔧 Prérequis

- **Node.js** v18+ ou supérieur
- **npm** v8+ ou supérieur
- **Angular CLI** v19+ (pour le développement)
- **Backend Zoo Arcadia** configuré et fonctionnel

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone [URL_DU_REPOSITORY]
cd arcadia-zoo-app-front
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créer les fichiers d'environnement dans `src/environments/` :

**environment.development.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

**environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-api-backend.com/api'
};
```

### 4. Lancer le serveur de développement

```bash
npm start
# ou
ng serve
```

L'application sera accessible à l'adresse `http://localhost:4200`

## 🏗️ Architecture

### Structure du projet

```
src/
├── app/
│   ├── core/                    # Services principaux et utilitaires
│   │   ├── auth/               # Authentification et autorisation
│   │   ├── services/           # Services partagés
│   │   └── token/              # Gestion des tokens JWT
│   ├── features/               # Modules fonctionnels
│   │   ├── animal/             # Gestion des animaux
│   │   ├── contact/            # Formulaire de contact
│   │   ├── dashboard/          # Tableaux de bord
│   │   │   ├── admin-dashboard/
│   │   │   ├── employe-dashboard/
│   │   │   └── veterinary-dashboard/
│   │   ├── habitats/           # Gestion des habitats
│   │   ├── home/               # Page d'accueil
│   │   ├── login/              # Connexion
│   │   └── services/           # Services du zoo
│   ├── shared/                 # Composants partagés
│   └── assets/                 # Ressources statiques
```

### Technologies utilisées

- **Angular 19.2.0** - Framework principal
- **TypeScript 5.5.0** - Langage de programmation
- **TailwindCSS 3.4.12** - Framework CSS
- **RxJS 7.8.0** - Programmation réactive
- **JWT** - Authentification sécurisée
- **Chart.js & NGX-Charts** - Visualisation de données
- **ESLint** - Qualité du code

## ✨ Fonctionnalités

### Fonctionnalités publiques
- 🏠 **Page d'accueil** avec présentation du zoo
- 🦒 **Catalogue des animaux** avec fiches détaillées
- 🌿 **Découverte des habitats** avec descriptions complètes
- 🎪 **Services proposés** par le zoo
- 📞 **Formulaire de contact** avec notifications
- 💬 **Système d'avis** des visiteurs

### Fonctionnalités privées (authentifiées)
- 🔐 **Authentification JWT** sécurisée
- 👤 **Gestion de profil** utilisateur
- 📊 **Tableaux de bord** adaptés par rôle
- 📈 **Statistiques** et rapports
- 🔔 **Système de notifications**

## 👥 Gestion des rôles

### 👑 Administrateur
- **Gestion des comptes** : Création, modification, suppression d'utilisateurs
- **Gestion des animaux** : CRUD complet des animaux
- **Gestion des habitats** : Administration des habitats
- **Gestion des services** : Configuration des services
- **Horaires d'ouverture** : Modification des horaires
- **Statistiques avancées** : Tableaux de bord complets
- **Historique** : Consultation de tous les historiques

### 👨‍⚕️ Vétérinaire
- **Rapports vétérinaires** : Création et consultation des rapports
- **Commentaires habitats** : Évaluation de l'état des habitats
- **Historique alimentation** : Suivi de l'alimentation des animaux
- **Santé animale** : Gestion de la santé des animaux

### 👨‍💼 Employé
- **Alimentation animaux** : Enregistrement des repas
- **Gestion des avis** : Modération des avis visiteurs
- **Historique personnel** : Consultation de ses actions

## 🎨 Design System

### Palette de couleurs
```css
:root {
  --primary: #FFFFFF;     /* Blanc principal */
  --secondary: #A3B583;   /* Vert clair */
  --tertiary: #557A46;    /* Vert moyen */
  --quaternary: #7A9F61;  /* Vert intermédiaire */
  --quinary: #0E1805;     /* Vert très foncé */
}
```

### Typographie
- **Principale** : Montserrat (sans-serif)
- **Titres** : Playfair Display (serif)

### Composants UI
- **Design responsive** adapté mobile/desktop
- **Animations fluides** avec Tailwind
- **Composants modulaires** réutilisables
- **Interface intuitive** et accessible

## 🔐 Sécurité

### Mesures de sécurité implémentées
- ✅ **Authentification JWT** avec tokens sécurisés
- ✅ **Guards Angular** pour la protection des routes
- ✅ **Intercepteurs HTTP** pour l'authentification automatique
- ✅ **Gestion des rôles** avec autorisations granulaires
- ✅ **Validation des formulaires** côté client
- ✅ **Protection CSRF** et XSS
- ✅ **Déconnexion automatique** par inactivité

### Services de sécurité
- `auth.service.ts` : Gestion de l'authentification
- `auth.guard.ts` : Protection des routes
- `auth.interceptor.ts` : Injection automatique des tokens
- `inactivity.service.ts` : Détection d'inactivité

## 📱 Pages principales

### Pages publiques
- `/` - Page d'accueil
- `/animals` - Catalogue des animaux
- `/animal/:id` - Détail d'un animal
- `/habitats` - Liste des habitats
- `/habitat/:id` - Détail d'un habitat
- `/services` - Services du zoo
- `/contact` - Formulaire de contact
- `/login` - Connexion

### Pages privées
- `/admin-dashboard` - Tableau de bord administrateur
- `/veterinary-dashboard` - Tableau de bord vétérinaire
- `/employe-dashboard` - Tableau de bord employé

## 🛠️ Scripts disponibles

```bash
# Développement
npm start                    # Démarre le serveur de développement
npm run ng serve            # Alternative pour démarrer

# Build
npm run build               # Build de production
npm run watch               # Build avec surveillance des changements

# Tests
npm run test                # Tests unitaires avec Karma
npm run e2e                 # Tests end-to-end

# Qualité du code
npm run lint                # Vérification ESLint
```

## 🔗 Intégration Backend

Cette application frontend fonctionne avec l'API backend Zoo Arcadia développée en NestJS.

### Endpoints principaux utilisés
- `/auth/*` - Authentification et autorisation
- `/animals/*` - Gestion des animaux
- `/habitats/*` - Gestion des habitats
- `/services/*` - Gestion des services
- `/users/*` - Gestion des utilisateurs
- `/dashboard/*` - Données des tableaux de bord
- `/mail/*` - Service de messagerie

### Configuration requise
Assurez-vous que le backend soit configuré avec :
- CORS activé pour l'origine frontend
- Variables d'environnement correctement définies
- Bases de données PostgreSQL et MongoDB opérationnelles

---

**Développé avec ❤️ pour le Zoo Arcadia**

*Pour toute question ou support technique, veuillez consulter la documentation du backend ou contacter l'équipe de développement.*
