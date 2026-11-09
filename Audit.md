# AUDIT.md — DropZone

**Projet :** DropZone-EXO  
**Dépôt :** Matteo-Lamare/DropZone-EXO  
**Branche principale :** main  
**Date :** 09/11/2026  
**Type d'audit :** Audit technique et DevOps

## 1. Présentation du projet

DropZone est une plateforme de vente de sneakers en édition limitée.

L'application permet de consulter les drops disponibles, de visualiser leur statut et de passer des commandes jusqu'à épuisement du stock.

L'architecture repose sur trois éléments principaux :
- Backend : Python 3.12, FastAPI et SQLAlchemy 2.
- Frontend : React 19, Vite et TypeScript.
- Base de données : SQLite en local et PostgreSQL pour le déploiement.

## 2. État des lieux technique

### Backend

Le backend dispose déjà :
- D'une API REST développée avec FastAPI.
- D'un serveur Uvicorn.
- D'une gestion des données avec SQLAlchemy.
- D'une configuration par variables d'environnement.
- D'un système de logs.
- De deux endpoints de santé : `/health` et `/health/ready`.
- De tests automatisés avec pytest.
- D'une configuration Ruff.

Les dépendances sont définies dans :
- `backend/requirements.txt`
- `backend/requirements-dev.txt`
- `backend/pyproject.toml`

### Frontend

Le frontend dispose déjà :
- De React 19.
- De Vite.
- De TypeScript.
- D'ESLint.
- De Vitest et Testing Library.
- De Playwright pour les tests E2E.
- D'une configuration Nginx pour le futur conteneur.

Les dépendances sont définies dans `frontend/package.json` et `frontend/package-lock.json`.

## 3. Points forts

- Architecture séparant frontend et backend.
- Dépendances Python épinglées.
- Dépendances Node.js verrouillées avec package-lock.json.
- Tests automatisés déjà présents.
- Couverture backend minimale configurée à 85 %.
- Vérification de disponibilité de la base de données.
- Gestion des variables d'environnement.
- Configuration Nginx déjà préparée.
- Documentation README détaillée.

## 4. Problèmes identifiés

| Problème | Conséquence |
|---|---|
| Absence de Dockerfile backend | Backend non conteneurisé |
| Absence de Dockerfile frontend | Frontend non conteneurisé |
| Absence de compose.yml | Lancement global non automatisé |
| Absence de .env.example | Configuration difficile à reproduire |
| Absence de workflow CI | Pas de validation automatique |
| Absence de workflow CD | Pas de déploiement automatisé |
| Absence de publication GHCR | Images non distribuées automatiquement |
| Absence de procédure de rollback | Retour à une version précédente non automatisé |
| Absence de métriques Prometheus | Monitoring incomplet |
| Logs en texte | Exploitation automatisée des logs moins pratique |
| Absence de CONTRIBUTING.md | Règles de contribution non documentées |
| Absence de CHANGELOG.md | Historique des versions non formalisé |

## 5. Analyse des risques

| Risque | Niveau |
|---|---|
| Déploiement manuel et difficile à reproduire | Élevé |
| Absence d'intégration continue | Élevé |
| Absence de procédure de rollback | Élevé |
| Absence de supervision complète | Élevé |
| Absence de documentation de contribution | Moyen |
| Gestion des secrets à formaliser | Élevé |

## 6. Plan d'action

| Priorité | Action | Livrable |
|---|---|---|
| 1 | Formaliser les règles Git | CONTRIBUTING.md |
| 2 | Formaliser les versions | CHANGELOG.md |
| 3 | Protéger la branche main | Paramètres GitHub |
| 4 | Conteneuriser le backend | backend/Dockerfile |
| 5 | Conteneuriser le frontend | frontend/Dockerfile |
| 6 | Configurer PostgreSQL et les services | compose.yml |
| 7 | Centraliser la configuration | .env.example |
| 8 | Automatiser les tests | .github/workflows/ci.yml |
| 9 | Publier les images Docker | .github/workflows/cd.yml |
| 10 | Mettre en place le rollback | Procédure de déploiement |
| 11 | Ajouter les métriques | Endpoint /metrics |
| 12 | Ajouter les logs JSON | Configuration logging |
| 13 | Installer Uptime Kuma | Supervision |

## 7. Conclusion

Le projet DropZone possède déjà une base applicative structurée et des outils de qualité logicielle.

Le backend et le frontend sont développés et disposent de configurations de tests adaptées.

Cependant, les éléments nécessaires à l'industrialisation restent à mettre en place : conteneurisation, intégration continue, déploiement continu et monitoring.

La réalisation de ces améliorations permettra d'obtenir une application plus fiable, reproductible et facilement déployable.

**Conclusion de l'audit :** le projet est une bonne base applicative, mais nécessite encore la mise en place de son infrastructure DevOps.
