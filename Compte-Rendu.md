# Compte rendu des questions

## Partie 1

### 1. Que se passe-t-il si quelqu'un pousse directement un code cassé sur `main` ? Comment l'empêcher ?

Un code défectueux poussé directement sur `main` peut rendre la branche principale instable et provoquer des erreurs dans l'application.

Pour l'empêcher, on peut protéger la branche `main` avec un ruleset GitHub qui :
- impose le passage par une Pull Request ;
- exige la réussite des vérifications CI avant la fusion ;
- bloque les pushs forcés et la suppression de la branche.

Dans notre projet, les deux vérifications CI sont `Backend (Python)` et `Frontend (Node.js)`.

### 2. Quels fichiers ne doivent jamais être commités ? Le `.gitignore` les couvre-t-il tous ?

Les fichiers contenant des informations sensibles ou générés automatiquement ne doivent généralement pas être commités.

Exemples :
- `.env` : peut contenir des mots de passe ou des clés API ;
- `node_modules/` : dépendances du frontend ;
- `.venv/` : environnement virtuel Python ;
- `__pycache__/` et `*.pyc` : fichiers générés par Python ;
- `.pytest_cache/` : cache des tests.

Le fichier `.gitignore` permet d'exclure ces fichiers des nouveaux ajouts. Il faut toutefois vérifier qu'ils ne sont pas déjà suivis par Git : une règle ajoutée dans `.gitignore` ne retire pas automatiquement un fichier déjà commité.

Un fichier `.env.example` peut être versionné s'il ne contient que des valeurs fictives ou des noms de variables, sans secret réel.

### 3. Quelle différence entre un tag léger et un tag annoté ? Lequel utiliser pour une version ?

Un tag léger est un simple pointeur vers un commit. Un tag annoté est un objet Git qui contient des métadonnées supplémentaires, notamment l'auteur, la date et un message.

Pour identifier une version officielle du projet, il est préférable d'utiliser un tag annoté.

Exemple :

```bash
git tag -a v0.1.0 -m "Release v0.1.0"
```

### 4. Un nouveau bouton, c'est un `feat` ou un `fix` ? Quel numéro de version change ?

Cela dépend de la nature du changement :
- `feat` : ajout d'une nouvelle fonctionnalité. Le numéro MINOR augmente.
- `fix` : correction d'un bug. Le numéro PATCH augmente.
- `BREAKING CHANGE` : changement incompatible avec les versions précédentes. Le numéro MAJOR augmente.

Par exemple, ajouter un bouton qui apporte une nouvelle fonctionnalité correspond à un `feat`. Corriger un bouton existant qui ne fonctionne pas correspond à un `fix`.

Le versionnage sémantique suit le format `MAJOR.MINOR.PATCH`.

## Partie 2

### 1. Pourquoi copier les dépendances avant le code ?

  Pour conserver le cache Docker des dépendances si seul le code change.

### 2. Que contient l'image finale de l'API ?

  Python, les dépendances runtime et le code de l'application. Pas les tests, le cache pip ni le .venv local.

### 3. Pourquoi éviter root ?

  Pour limiter les privilèges en cas de compromission du conteneur.

### 4. Pourquoi Nginx écoute sur 8080 ?

  Un utilisateur non privilégié peut écouter sur un port supérieur à 1024.

### 5. Pourquoi db et pas localhost ?

  Compose fournit un DNS interne : db désigne le conteneur PostgreSQL.

### 6. Pourquoi attendre healthy ?
  
  Pour éviter de démarrer l'API avant que PostgreSQL accepte les connexions.

### 7. Où sont les données ?

  Dans le volume nommé postgres_data, conservé après docker compose down, mais supprimé avec docker compose down -v.

## Partie 3

### 1. Pourquoi séparer lint, tests et E2E en jobs distincts plutôt qu'un seul gros job ? Qu'est-ce qui tourne en parallèle ?

  Pour mieux organiser les vérifications et repérer les erreurs plus facilement. Le lint, les tests backend et frontend tournent en parallèle. Les tests E2E démarrent seulement si les trois premiers réussissent.

### 2. Pourquoi l'E2E en dernier ? Combien de temps gagne-t-on quand le lint échoue ?

  Parce qu'ils prennent plus de temps et nécessitent Docker et un navigateur. Cela évite de perdre du temps si une vérification précédente échoue.

### 3. Sur quel fichier se base la clé du cache ? Que se passe-t-il quand il change ?

  Le cache utilise backend/requirements-dev.txt pour Python et frontend/package-lock.json pour Node.js. Si ces fichiers changent, les dépendances sont réinstallées et un nouveau cache est créé.

### 4. De quels droits votre workflow a-t-il vraiment besoin ? Que pourrait faire un workflow compromis avec des droits en écriture ?

  Pour sécuriser le dépôt. Le workflow possède uniquement le droit de lecture (contents: read). Cela limite les dégâts possibles si une action est compromise.

### 5. Pour un test E2E : comment être sûr qu'il ne dépend pas des données d'un autre test ? (Le test peut créer son propre drop par l'API avant d'ouvrir la page.)

  Chaque test crée son propre drop avec une requête API avant d'ouvrir la page. Il ne dépend donc pas des données déjà présentes.

### 6. Quels tests unitaires font échouer la CI si quelqu'un casse la règle « jamais deux fois la dernière paire » ?

  Les tests test_last_pair_cannot_be_sold_twice et test_order_rejected_if_drop_is_sold_out vérifient qu'une deuxième commande est refusée lorsque le stock est épuisé.

### 7. Qu'est-ce qu'act ne sait pas reproduire de GitHub ?

  act permet de tester les workflows localement, mais ne reproduit pas totalement GitHub : les secrets, les permissions, les runners et les règles de protection des branches peuvent être différents.


## Partie 4

### 1. Pourquoi le CD ne relance-t-il pas les tests ? Qu'est-ce qui garantit que le commit tagué est sain ?

Le CD publie un commit déjà validé par la CI. Le tag doit être posé sur un commit de `main`, après fusion d'une Pull Request dont les vérifications obligatoires ont réussi. La protection de `main` et les status checks requis constituent donc la garantie. Il ne faut pas taguer directement un commit non testé ou une branche de fonctionnalité.

### 2. De quels droits chaque job a-t-il besoin ? Pourquoi les attribuer job par job ?

Les permissions sont limitées au strict nécessaire :
- Publication GHCR : `contents: read` et `packages: write`.
- Déploiement GitHub Pages : `contents: read`, `pages: write` et `id-token: write`.
- Création de la Release : `contents: write`.

Les attribuer job par job réduit les privilèges disponibles si une action ou un job est compromis. Le workflow entier démarre avec `permissions: {}`.

### 3. Faut-il créer un mot de passe pour pousser sur GHCR depuis GitHub Actions ?

Non. L'action se connecte à GHCR avec le `GITHUB_TOKEN` fourni par GitHub Actions. Le job de publication reçoit le droit `packages: write`, et le token est utilisé par `docker/login-action`. Aucun PAT ni mot de passe personnel n'est nécessaire.

### 4. Quelle conséquence du sous-chemin GitHub Pages pour les fichiers et les routes ?

Le site est servi sous `/DropZone-EXO/`, pas à la racine du domaine. Vite doit donc compiler les ressources avec `base: /DropZone-EXO/`. Une route BrowserRouter comme `/drops/3` rechargée directement peut renvoyer une 404, car Pages ne sait pas faire de fallback vers `index.html`. Pour ce build, HashRouter utilise une URL comme `/#/drops/3`, dont le fragment est traité côté navigateur.

### 5. Comment le front connaît-il l'API sur Pages ? Que montre-t-il sans API publique ?

Le workflow lit la variable de dépôt `PUBLIC_API_URL` au moment du build et la transmet à Vite via `VITE_API_URL`. L'URL doit être publique et l'API doit autoriser l'origine du site Pages dans sa configuration CORS. Si la variable n'est pas renseignée, le frontend affiche explicitement que l'API est injoignable et qu'aucune URL publique n'est configurée. Les appels API ne peuvent pas passer par le proxy Nginx de la stack Docker, car Pages héberge uniquement les fichiers statiques.

### 6. Un rollback reconstruit-il l'ancienne version ? Qu'est-ce qui ne revient pas en arrière ?

Non. Le rollback réutilise les images déjà publiées avec l'ancien tag, par exemple `0.4.0`, puis recrée les conteneurs avec `docker compose up --no-build`. Aucun build n'est nécessaire. En revanche, le volume PostgreSQL et ses données persistent. Une évolution du schéma de base ou des données n'est pas annulée par le retour à une ancienne image : il faut prévoir une restauration ou une migration corrective séparée.
