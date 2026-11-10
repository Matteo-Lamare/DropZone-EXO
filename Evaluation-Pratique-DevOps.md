# Évaluation pratique — Mise en place d'une chaîne DevOps

## Contexte

Vous reprenez **DropZone**, une application composée d'une API FastAPI, d'une interface React/Vite et d'une base PostgreSQL en déploiement.

Votre mission : rendre le projet fiable, testable, conteneurisé et déployable automatiquement. Vous devez démontrer chaque étape à l'aide de commandes, de fichiers de configuration et de résultats vérifiables.

**Durée indicative :** 2 h 30 à 3 h  
**Barème :** 20 points  
**Travail :** individuel

## Objectifs

À la fin de l'évaluation, vous devez savoir :

- gérer le code avec Git et les Pull Requests ;
- construire et démarrer une application avec Docker Compose ;
- automatiser les contrôles avec GitHub Actions (CI) ;
- publier et déployer une version avec GitHub Actions (CD) ;
- revenir à une version précédente en cas de problème.

## Consignes

- Travaillez sur une branche dédiée, pas directement sur `main`.
- Ne commitez aucun secret, mot de passe réel ou fichier `.env`.
- Faites des commits avec des messages explicites.
- Vérifiez les résultats après chaque étape.
- Ne supprimez pas le volume PostgreSQL pendant les opérations normales ou le rollback.
- Joignez des captures d'écran ou des liens vers les exécutions GitHub Actions pour prouver les résultats.

---

## Mission 1 — Préparer le dépôt (3 points)

1. Récupérez le projet et créez une branche de travail.
2. Vérifiez le contenu du fichier `.gitignore`. Ajoutez les fichiers générés ou sensibles manquants.
3. Vérifiez qu'aucun secret ou fichier local inutile n'est suivi par Git.
4. Réalisez une modification simple et pertinente de l'application ou de sa documentation.
5. Commitez avec un message respectant une convention de type `feat:`, `fix:` ou `docs:`.
6. Ouvrez une Pull Request vers `main` et faites vérifier les contrôles avant la fusion.

**À rendre :** nom de la branche, historique des commits et lien vers la Pull Request.

## Mission 2 — Conteneuriser l'application (4 points)

1. Vérifiez les Dockerfiles du backend et du frontend.
2. Assurez-vous que les dépendances sont installées avant la copie du code afin de profiter du cache Docker.
3. Vérifiez que l'image finale ne contient pas les outils ou fichiers de développement inutiles.
4. Vérifiez que les services ne tournent pas en tant que root lorsque cela est possible.
5. Démarrez l'application et PostgreSQL avec Docker Compose.
6. Vérifiez l'état des conteneurs et l'état de santé de l'API.
7. Vérifiez que les données PostgreSQL sont conservées après un arrêt puis un redémarrage des conteneurs.

Commandes de contrôle possibles :

```bash
docker compose up -d --build
docker compose ps
docker compose logs
docker compose down
docker compose up -d
```

**Attention :** n'utilisez pas `docker compose down -v`, car cette commande supprime aussi les volumes.

**À rendre :** fichiers Docker concernés, sortie de `docker compose ps` et preuve que les données persistent après redémarrage.

## Mission 3 — Mettre en place l'intégration continue (5 points)

Configurez un workflow GitHub Actions déclenché lors d'un push sur `main` et lors d'une Pull Request vers `main`.

Le workflow doit :

1. contrôler la qualité du backend avec Ruff ;
2. exécuter les tests backend avec pytest et vérifier le seuil de couverture configuré ;
3. contrôler le frontend avec ESLint et TypeScript ;
4. exécuter les tests frontend et compiler l'application ;
5. lancer les tests end-to-end avec Playwright après la réussite des contrôles précédents.

Les jobs indépendants doivent pouvoir s'exécuter en parallèle. Le job end-to-end doit attendre leur réussite.

**Test de validation :** introduisez volontairement une erreur simple dans une branche de test, vérifiez que la CI échoue, puis corrigez-la et vérifiez que la CI réussit.

**À rendre :** fichier du workflow, lien vers une exécution en échec et lien vers une exécution réussie.

## Mission 4 — Publier et déployer une version (5 points)

Configurez un workflow de déploiement continu déclenché par la création d'un tag de version au format `vMAJOR.MINOR.PATCH`.

Le workflow doit :

1. construire et publier l'image de l'API sur GitHub Container Registry (GHCR) ;
2. construire et publier l'image du frontend sur GHCR ;
3. publier des tags de version et un identifiant de commit pour chaque image ;
4. construire le frontend pour GitHub Pages et le déployer ;
5. créer une GitHub Release uniquement si la publication des images et le déploiement Pages ont réussi.

Respectez le principe du moindre privilège : chaque job reçoit uniquement les permissions GitHub dont il a besoin.

Configurez les paramètres GitHub nécessaires : Pages avec la source GitHub Actions, environnement de déploiement et visibilité publique des images si elles doivent être téléchargées sans authentification.

Créez un tag annoté sur un commit de `main` déjà validé par la CI, puis poussez ce tag.

Exemple :

```bash
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

**À rendre :** fichier CD, lien vers l'exécution réussie, page GitHub Pages, images GHCR et GitHub Release.

## Mission 5 — Démontrer le déploiement et le rollback (3 points)

1. Démarrez la version publiée avec `compose.prod.yml` et la variable `DROPZONE_VERSION`.
2. Vérifiez que les images sont téléchargées depuis GHCR et que les services démarrent.
3. Publiez une deuxième version avec un nouveau tag.
4. Vérifiez que les deux versions d'images sont disponibles.
5. Revenez à la première version en modifiant `DROPZONE_VERSION`, puis en recréant les conteneurs sans reconstruire les images.

Exemple sous Windows PowerShell :

```powershell
$env:DROPZONE_VERSION = "1.0.0"
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d

# Pour revenir à la version précédente :
$env:DROPZONE_VERSION = "0.9.0"
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d --no-build --force-recreate
docker compose -f compose.prod.yml ps
```

Adaptez les numéros aux versions réellement publiées.

**À rendre :** preuve de démarrage des deux versions et preuve du retour à la première. Expliquez ce qui arrive aux données PostgreSQL pendant le rollback.

---

## Barème

| Compétence évaluée | Points |
|---|---:|
| Gestion Git, branche, commits et Pull Request | 3 |
| Dockerfiles, Compose, santé des services et persistance | 4 |
| CI : qualité, tests, parallélisation et E2E | 5 |
| CD : GHCR, versionnage, Pages, Release et permissions | 5 |
| Déploiement de deux versions et rollback | 3 |
| **Total** | **20** |

## Questions de bilan

Répondez brièvement, avec vos propres mots :

1. Pourquoi faut-il protéger la branche `main` ?
2. Pourquoi utilise-t-on un tag annoté pour publier une version ?
3. Quel est l'intérêt de séparer les jobs de CI ?
4. Pourquoi un conteneur ne doit-il pas fonctionner en root ?
5. Pourquoi le frontend GitHub Pages a-t-il besoin d'une configuration différente de celle utilisée en local ?
6. Pourquoi le rollback d'une image Docker ne restaure-t-il pas automatiquement la base de données ?

## Critères de réussite

L'évaluation est considérée comme réussie si :

- la CI échoue lorsqu'un contrôle ou un test échoue ;
- la CI passe après correction ;
- les images des deux composants sont publiées dans GHCR ;
- le frontend est déployé sur GitHub Pages ;
- une Release est créée après la réussite du CD ;
- deux versions sont disponibles et le retour à la première fonctionne ;
- les données PostgreSQL ne sont pas supprimées pendant le rollback.

## Ressources du projet

- Dépôt : https://github.com/Matteo-Lamare/DropZone-EXO
- Site GitHub Pages : https://matteo-lamare.github.io/DropZone-EXO/
- Documentation API locale : http://localhost:8000/docs
