[![CI](https://github.com/Matteo-Lamare/DropZone-EXO/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Matteo-Lamare/DropZone-EXO/actions/workflows/ci.yml)

# DropZone

**DropZone** est une plateforme de vente de sneakers en édition limitée. Chaque *drop* propose un nombre défini de paires, disponibles à une heure précise. Les commandes sont acceptées jusqu'à épuisement du stock.

> **Projet pédagogique — BTS SIO SLAM**
>
> Ce projet est réalisé dans le cadre du cours « Introduction DevOps ». L'objectif est de mettre en place progressivement une chaîne de livraison et d'exploitation : conteneurisation, intégration continue, déploiement continu et supervision.
>
> L'application ne dispose pas d'un système d'authentification.

---

## Sommaire

- [DropZone](#dropzone)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Technologies](#technologies)
  - [Architecture](#architecture)
  - [Installation locale](#installation-locale)
    - [Prérequis](#prérequis)
    - [1. Récupérer le projet](#1-récupérer-le-projet)
    - [2. Démarrer le backend](#2-démarrer-le-backend)
    - [3. Démarrer le frontend](#3-démarrer-le-frontend)
  - [Configuration](#configuration)
    - [Exemple avec PostgreSQL](#exemple-avec-postgresql)
  - [Tests et qualité du code](#tests-et-qualité-du-code)
  - [Déploiement continu](#déploiement-continu)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Tests end-to-end](#tests-end-to-end)
  - [Documentation de l'API](#documentation-de-lapi)
    - [Endpoints disponibles](#endpoints-disponibles)
    - [Codes de réponse principaux](#codes-de-réponse-principaux)
    - [Exemple : créer un drop](#exemple--créer-un-drop)
    - [Exemple : consulter les drops disponibles](#exemple--consulter-les-drops-disponibles)
    - [Exemple : passer une commande](#exemple--passer-une-commande)
    - [Structure d'un drop](#structure-dun-drop)
  - [Structure du dépôt](#structure-du-dépôt)
  - [Roadmap DevOps](#roadmap-devops)
  - [Licence](#licence)

---

## Fonctionnalités

- Consultation de la liste des drops.
- Filtrage par statut : `upcoming`, `live` et `sold_out`.
- Compte à rebours avant l'ouverture d'un drop.
- Consultation des détails d'un produit.
- Passage de commandes depuis la page d'un drop.
- Décrémentation atomique du stock afin d'éviter la vente de la dernière paire plusieurs fois.
- Insertion automatique de données de démonstration au premier démarrage.

## Technologies

| Composant | Technologies |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2, Uvicorn |
| Base de données | SQLite en local, PostgreSQL pour le déploiement |
| Frontend | React 19, TypeScript, Vite |
| Serveur web | Nginx |
| Tests backend | pytest, pytest-cov |
| Qualité backend | Ruff |
| Tests frontend | Vitest, Testing Library |
| Tests end-to-end | Playwright |
| Qualité frontend | ESLint, TypeScript |

## Architecture

L'application est organisée en deux parties principales :

- **Backend** : expose une API REST avec FastAPI, gère les drops, les commandes et les interactions avec la base de données.
- **Frontend** : fournit l'interface utilisateur avec React et communique avec le backend via des requêtes HTTP.

La base de données peut être SQLite pour le développement local ou PostgreSQL pour un environnement de déploiement.

```text
Utilisateur
    |
    v
Frontend React / Vite
    |
    | Requêtes HTTP (/api)
    v
Backend FastAPI / Uvicorn
    |
    v
SQLAlchemy
    |
    v
SQLite ou PostgreSQL
```

## Installation locale

### Prérequis

Installer les outils suivants :

| Outil | Version minimale |
|---|---|
| Git | Version récente |
| Python | 3.12 |
| Node.js | 22.12 |
| npm | Version fournie avec Node.js |

### 1. Récupérer le projet

```bash
git clone https://github.com/Matteo-Lamare/DropZone-EXO.git
cd DropZone-EXO
```

### 2. Démarrer le backend

Dans un premier terminal :

```bash
cd backend

# Créer l'environnement virtuel
python -m venv .venv

# Activer l'environnement virtuel
# Linux / macOS
source .venv/bin/activate

# Windows PowerShell
.venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements-dev.txt

# Lancer l'API
uvicorn app.main:app --reload
```

Le backend est accessible à l'adresse :

- API : http://localhost:8000
- Documentation Swagger : http://localhost:8000/docs
- Documentation ReDoc : http://localhost:8000/redoc

Par défaut, l'application utilise SQLite. Le fichier `dropzone.db` est créé localement au démarrage et n'est pas destiné à être versionné.

### 3. Démarrer le frontend

Dans un second terminal :

```bash
cd frontend

# Installer les dépendances
npm ci

# Démarrer le serveur de développement
npm run dev
```

Le frontend est accessible à l'adresse :

http://localhost:5173

Les requêtes effectuées sur `/api` sont redirigées vers le backend, par défaut sur `http://localhost:8000`.

---

## Configuration

Le backend utilise des variables d'environnement pour gérer sa configuration. Elles peuvent être définies directement dans le terminal ou dans un fichier `backend/.env` (qui ne doit pas être commité).

| Variable | Description | Valeur par défaut |
|---|---|---|
| `DATABASE_URL` | URL de connexion SQLAlchemy | `sqlite:///./dropzone.db` |
| `LOG_LEVEL` | Niveau de journalisation | `INFO` |
| `SEED_DEMO_DATA` | Active l'insertion des données de démonstration | `true` |
| `CORS_ORIGINS` | Liste des origines autorisées, séparées par des virgules | Vide |

Le frontend utilise également les variables suivantes :

| Variable | Description | Valeur par défaut |
|---|---|---|
| `VITE_API_URL` | URL de l'API utilisée par le frontend | `/api` |
| `API_PROXY_TARGET` | Adresse du backend ciblé par le proxy Vite | `http://localhost:8000` |

### Exemple avec PostgreSQL

Pour utiliser une base PostgreSQL existante :

```bash
DATABASE_URL="postgresql+psycopg://utilisateur:motdepasse@localhost:5432/dropzone"
```

Adapter les identifiants et le nom de la base à votre environnement.

---

## Tests et qualité du code

Le projet intègre des outils de vérification et de tests pour le backend et le frontend.

### Backend

Depuis le dossier `backend`, avec l'environnement virtuel activé :

```bash
# Vérification du code
ruff check .

# Vérification du formatage
ruff format --check .

# Exécution des tests avec couverture
pytest
```

Le seuil minimal de couverture configuré pour les tests backend est de **85 %**.

### Frontend

Depuis le dossier `frontend` :

```bash
# Analyse statique
npm run lint

# Vérification TypeScript
npm run typecheck

# Tests unitaires
npm test

# Compilation de production
npm run build
```

Les fichiers compilés sont générés dans le dossier `dist/`.

### Tests end-to-end

Les tests Playwright permettent de vérifier le fonctionnement global de l'application :

```bash
# Installer Chromium pour Playwright
npx playwright install chromium

# Lancer les tests end-to-end
npm run test:e2e
```

Par défaut, les tests ciblent `http://localhost:8080`. Une autre adresse peut être définie avec la variable `E2E_BASE_URL`.

L'application complète doit être accessible à cette adresse avant l'exécution des tests.

---

## Déploiement continu

Le workflow `.github/workflows/cd.yml` se déclenche lorsqu'un tag Git commençant par `v` est poussé. Il publie les images de l'API et du frontend sur GHCR, déploie le frontend sur GitHub Pages, puis crée une Release avec des notes générées.

### Configuration GitHub requise

1. Dans **Settings → Pages**, sélectionner **GitHub Actions** comme *Build and deployment source*.
2. Dans **Settings → Environments → github-pages**, autoriser les déploiements déclenchés par les tags `v*` (ou supprimer la restriction de branches/tags si le dépôt ne permet pas une règle plus précise).
3. Dans **Settings → Secrets and variables → Actions → Variables**, créer la variable `PUBLIC_API_URL` avec l'URL HTTPS publique de l'API, sans slash final. Si elle n'est pas définie, le site affiche que l'API est injoignable.
4. Dans **Packages**, régler la visibilité de `dropzone-api` et `dropzone-front` sur **Public** pour permettre le pull sans authentification.

Le dépôt doit être public pour utiliser GitHub Pages avec GitHub Free. L'URL du site de ce dépôt est :

`https://matteo-lamare.github.io/DropZone-EXO/`

Le frontend Pages est compilé avec une base `/DropZone-EXO/` et un routeur à fragments (`/#/drops/3`). Le fragment évite une erreur 404 lors du rechargement d'une page interne sur l'hébergement statique. Contrairement à la stack Docker, Pages ne dispose pas du proxy Nginx `/api` : `PUBLIC_API_URL` doit donc pointer vers une API publique configurée pour autoriser l'origine `https://matteo-lamare.github.io` dans `CORS_ORIGINS`.

### Lancer les images publiées

Le fichier `compose.prod.yml` utilise les images GHCR. La version est pilotée par `DROPZONE_VERSION` et aucune compilation locale n'est nécessaire.

Sous Windows PowerShell :

```powershell
$env:DROPZONE_VERSION = "0.4.0"
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d
docker compose -f compose.prod.yml ps
```

Sous Linux/macOS :

```bash
DROPZONE_VERSION=0.4.0 docker compose -f compose.prod.yml pull
DROPZONE_VERSION=0.4.0 docker compose -f compose.prod.yml up -d
docker compose -f compose.prod.yml ps
```

L'interface locale est disponible sur `http://localhost:8080`. Les identifiants PostgreSQL peuvent être personnalisés avec `POSTGRES_USER`, `POSTGRES_PASSWORD` et un `DATABASE_URL` cohérent avec ces valeurs ; ne pas utiliser les valeurs par défaut en production.

### Publier une version et effectuer un rollback

Le tag doit désigner un commit de `main` dont les contrôles CI ont réussi. La protection de `main` et les status checks obligatoires garantissent que seuls les commits validés sont fusionnés ; le CD ne relance donc pas les mêmes tests.

Exemple de cycle de publication :

```bash
git checkout main
git pull origin main
git tag -a v0.4.0 -m "Release v0.4.0"
git push origin v0.4.0
# Après validation de la Release et des deux packages :
git tag -a v0.5.0 -m "Release v0.5.0"
git push origin v0.5.0
```

Pour revenir à la version précédente, réutiliser son tag d'image, sans reconstruire :

```powershell
$env:DROPZONE_VERSION = "0.4.0"
docker compose -f compose.prod.yml pull api front
docker compose -f compose.prod.yml up -d --no-build --force-recreate
docker compose -f compose.prod.yml ps
```

Le rollback remplace les conteneurs par les anciennes images déjà publiées. Le volume PostgreSQL reste conservé : les données et les éventuelles évolutions de schéma ne sont pas annulées automatiquement. Une migration de base incompatible nécessite une procédure de restauration ou une migration corrective distincte.


### Questions de compréhension — CD

**1. Pourquoi le CD ne relance-t-il pas les tests ?**

Le workflow CD se concentre sur la livraison : il publie les artefacts d'un commit déjà contrôlé par la CI. Les tests sont exécutés lors des pushes et des pull requests vers `main`. Pour garantir qu'un tag pointe vers un commit sain, il faut fusionner dans `main` uniquement après le succès des contrôles requis et poser le tag sur ce commit validé. Cette garantie dépend de la configuration effective des règles de protection de `main` et des status checks obligatoires ; le simple fait de déclencher le CD par un tag ne garantit pas, à lui seul, que les tests ont réussi.

**2. Quels droits chaque job utilise-t-il ? Pourquoi les définir job par job ?**

Le workflow commence avec `permissions: {}` (aucun droit implicite), puis accorde uniquement les permissions nécessaires :
- `publish-images` : `contents: read` pour récupérer le code et `packages: write` pour publier les images sur GHCR.
- `deploy-pages` : `contents: read` pour récupérer le frontend, `pages: write` pour publier le site et `id-token: write` pour obtenir le jeton OIDC utilisé par le déploiement Pages.
- `create-release` : `contents: write` pour créer la Release GitHub.

Cette séparation applique le principe du moindre privilège : si un job ou une action est compromis, ses permissions limitées réduisent les actions possibles.

**3. Faut-il créer un mot de passe pour pousser sur GHCR depuis GitHub Actions ?**

Non. Le workflow se connecte à GHCR avec le jeton temporaire `GITHUB_TOKEN`, fourni par GitHub Actions. Le job de publication reçoit `packages: write`, ce qui lui permet de publier les images dans le registre associé au dépôt. Il n'est donc pas nécessaire de créer un Personal Access Token pour ce workflow.

**4. Quelles conséquences du sous-chemin GitHub Pages ?**

Le site est servi sous `/DropZone-EXO/`, et non à la racine du domaine. Vite doit donc construire les chemins des ressources (JavaScript, CSS, favicon) avec cette base. Le projet calcule cette base à partir du nom du dépôt dans la configuration Vite. Pour les routes applicatives, le frontend utilise `HashRouter` : une URL comme `/#/drops/3` conserve le chemin du site et place la route après le fragment `#`. Le navigateur peut ainsi recharger cette URL sans demander à GitHub Pages de servir directement un chemin inexistant comme `/drops/3`.

**5. Comment le frontend connaît-il l'adresse de l'API sur Pages ?**

GitHub Pages ne fournit pas de proxy Nginx pour rediriger `/api` vers le backend. L'adresse publique de l'API est donc injectée au moment de la compilation dans `VITE_API_URL`, à partir de la variable de dépôt `PUBLIC_API_URL`. Le backend doit autoriser l'origine `https://matteo-lamare.github.io` dans sa configuration CORS. Si `PUBLIC_API_URL` n'est pas renseignée, le frontend affiche le message indiquant qu'aucune URL d'API publique n'est configurée et ne peut pas charger les drops.

**6. Que restaure un rollback ?**

Le rollback réutilise une image Docker déjà publiée avec le tag de la version précédente ; il ne reconstruit pas l'ancienne version. On change `DROPZONE_VERSION`, on récupère les images correspondantes et on recrée les conteneurs. En revanche, le rollback applicatif ne restaure ni les données persistées dans le volume PostgreSQL, ni automatiquement le schéma de la base. Une migration de schéma incompatible nécessite une stratégie distincte (migration réversible, migration corrective ou restauration d'une sauvegarde).

## Documentation de l'API

Le backend expose une API REST.

### Endpoints disponibles

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Vérifie que le processus API répond |
| `GET` | `/health/ready` | Vérifie que l'API et la base de données sont disponibles |
| `GET` | `/drops` | Récupère la liste des drops |
| `GET` | `/drops?status=live` | Filtre les drops par statut |
| `GET` | `/drops/{id}` | Récupère un drop précis |
| `POST` | `/drops` | Crée un nouveau drop |
| `POST` | `/drops/{id}/orders` | Passe une commande sur un drop |

### Codes de réponse principaux

| Code HTTP | Signification |
|---|---|
| `200` | Requête effectuée avec succès |
| `201` | Ressource créée |
| `404` | Ressource introuvable |
| `409` | Drop non ouvert ou stock épuisé |
| `422` | Données envoyées invalides |
| `503` | Service indisponible pour la readiness |

### Exemple : créer un drop

```bash
curl -X POST http://localhost:8000/drops \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Air Max 1",
    "price_cents": 18000,
    "stock": 100,
    "opens_at": "2030-01-01T09:00:00Z"
  }'
```

Le prix est exprimé en centimes : `18000` correspond à 180,00 €.

### Exemple : consulter les drops disponibles

```bash
curl http://localhost:8000/drops
```

### Exemple : passer une commande

```bash
curl -X POST http://localhost:8000/drops/1/orders
```

La commande est refusée si le drop n'est pas encore ouvert ou si le stock est épuisé.

### Structure d'un drop

Un drop contient notamment les propriétés suivantes :

| Champ | Description |
|---|---|
| `id` | Identifiant du drop |
| `product` | Nom du produit |
| `description` | Description du produit |
| `price_cents` | Prix en centimes |
| `stock` | Stock initial |
| `remaining` | Stock restant |
| `opens_at` | Date d'ouverture au format RFC 3339 |
| `status` | Statut calculé lors de la lecture |

La documentation interactive complète est disponible sur `/docs`.

---

## Structure du dépôt

```text
DropZone-EXO/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── ...
│   ├── tests/
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── requirements-dev.txt
│
├── frontend/
│   ├── src/
│   ├── e2e/
│   ├── nginx.conf
│   ├── playwright.config.ts
│   └── package.json
│
└── README.md
```

- `backend/app/` : code source de l'API.
- `backend/tests/` : tests automatisés du backend.
- `frontend/src/` : composants, pages et tests frontend.
- `frontend/e2e/` : scénarios de tests end-to-end.
- `frontend/nginx.conf` : configuration Nginx prévue pour servir le frontend.

---

## Roadmap DevOps

Le TP vise à faire évoluer le projet vers une chaîne DevOps complète.

| Étape | Objectif | État |
|---|---|---|
| 1. Gestion du dépôt | Documentation, conventions Git, protection de `main`, versionnement | Terminé |
| 2. Conteneurisation | Dockerfiles backend et frontend, PostgreSQL et Compose | Terminé |
| 3. Intégration continue | GitHub Actions : lint, tests et E2E | Terminé |
| 4. Déploiement continu | Publication des images sur GHCR et déploiement | En cours |
| 5. Supervision | Health checks, logs structurés, métriques et Uptime Kuma | À réaliser |

Les états de cette roadmap sont mis à jour au fur et à mesure de la réalisation du TP.

## Licence

Ce projet est distribué sous licence MIT.
