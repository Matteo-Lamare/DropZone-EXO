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
