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
