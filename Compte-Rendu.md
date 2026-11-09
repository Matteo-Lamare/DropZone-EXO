# Compte rendu des question

## Partie 1

1. Que se passe-t-il si quelqu'un pousse directement un code cassé sur main ? Comment l'empêcher ?

  Un code défectueux poussé directement sur main peut rendre la branche principale instable et provoquer des erreurs dans l'application.

  On peut l'empecher en mettant un ruleset sur la branche et force l'ajout par pull request

2. Quels fichiers ne doivent jamais être commités ? Le .gitignore les couvre-t-il tous ?

  Les fichiers contenant des informations sensibles ou générés automatiquement ne doivent pas être commités.

  Le fichier .gitignore permet d'exclure ces fichiers. Il faut toutefois vérifier qu'ils ne sont pas déjà suivis par Git.

3. Quelle différence entre un tag léger et un tag annoté ? Lequel utiliser pour une version ?

  Un tag léger est un simple pointeur vers un commit. Un tag annoté contient des informations supplémentaires : auteur, date et message.

  Pour identifier une version officielle du projet, il est préférable d'utiliser un tag annoté.

4. Un nouveau bouton, c'est un feat ou un fix ? Quel numéro de version change ?

  c'est un feat car on ajooute une fonctionnalitée

  le numero a changer est le deuxieme , c'est une version mineur
